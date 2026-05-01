import os
import json
import hmac
import time
import hashlib
import threading
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://genaroroustan.github.io'])

# --- Deduplicación persistente con MÚLTIPLES llaves ---
# El envío se acepta sólo si NINGUNA de estas llaves coincide con un envío previo:
#   sid:<_submissionId>                   ventana 24h  (id único del frontend)
#   ctk:<cedula>:<token>                  ventana 24h  (mismo candidato + mismo link, primer envío gana)
#   hash:<sha256(cedula|puesto|answers)>  ventana 24h  (huella del contenido — caza retransmisiones idénticas)
#   ced:<cedula>:<bucket-600s>            ventana 10min (último recurso si falta sid y token)
# Cuando se acepta un envío, se registran TODAS las llaves aplicables, así cualquier
# reenvío futuro que coincida en cualquiera de ellas se rechaza.
_DEDUP_WINDOW_24H = 86400
_DEDUP_WINDOW_FALLBACK = 600
_DEDUP_FILE = os.environ.get('DEDUP_CACHE_PATH', 'dedup_cache.json')
_dedup_lock = threading.Lock()


def _load_dedup_cache() -> dict[str, float]:
    try:
        with open(_DEDUP_FILE, 'r') as f:
            data = json.load(f)
        if isinstance(data, dict):
            now = time.time()
            return {k: float(v) for k, v in data.items() if now - float(v) <= _DEDUP_WINDOW_24H}
    except (FileNotFoundError, json.JSONDecodeError, ValueError, OSError) as e:
        if not isinstance(e, FileNotFoundError):
            print(f"[PROXY] dedup cache no se pudo leer ({e}); arrancando vacío", flush=True)
    return {}


def _save_dedup_cache_locked(cache: dict[str, float]) -> None:
    try:
        tmp_path = _DEDUP_FILE + '.tmp'
        with open(tmp_path, 'w') as f:
            json.dump(cache, f)
        os.replace(tmp_path, _DEDUP_FILE)
    except OSError as e:
        print(f"[PROXY] No se pudo persistir dedup cache: {e}", flush=True)


_dedup_cache: dict[str, float] = _load_dedup_cache()
print(f"[PROXY] dedup cache cargada con {len(_dedup_cache)} entradas", flush=True)


def _content_hash(cedula: str, puesto: str, answers) -> str:
    # Hash determinístico del contenido: si dos envíos tienen el mismo candidato,
    # mismo puesto y exactamente las mismas respuestas, se consideran el mismo envío.
    try:
        normalized = json.dumps(
            {'c': cedula, 'p': puesto, 'a': answers},
            sort_keys=True,
            ensure_ascii=False,
            separators=(',', ':'),
        )
    except (TypeError, ValueError):
        normalized = f"{cedula}|{puesto}|{answers}"
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


def _build_dedup_keys(data: dict) -> list[tuple[str, int]]:
    keys: list[tuple[str, int]] = []
    submission_id = str(data.get('_submissionId') or '').strip()
    cedula = str(data.get('cedula') or '').strip()
    token = str(data.get('token') or '').strip()
    puesto = str(data.get('puesto') or '').strip()
    answers = data.get('answers')

    if submission_id:
        keys.append((f"sid:{submission_id}", _DEDUP_WINDOW_24H))
    if cedula and token:
        keys.append((f"ctk:{cedula}:{token}", _DEDUP_WINDOW_24H))
    if cedula and answers is not None:
        keys.append((f"hash:{_content_hash(cedula, puesto, answers)}", _DEDUP_WINDOW_24H))
    if cedula and not submission_id and not token:
        bucket = int(time.time() // _DEDUP_WINDOW_FALLBACK)
        keys.append((f"ced:{cedula}:{bucket}", _DEDUP_WINDOW_FALLBACK))
    return keys


def _purge_expired_locked(now: float) -> None:
    expired = []
    for k, t in _dedup_cache.items():
        age = now - t
        if k.startswith('ced:') and age > _DEDUP_WINDOW_FALLBACK:
            expired.append(k)
        elif age > _DEDUP_WINDOW_24H:
            expired.append(k)
    for k in expired:
        del _dedup_cache[k]


N8N_URL = os.environ.get('N8N_WEBHOOK_URL')
API_KEY = os.environ.get('N8N_API_KEY')
N8N_DASHBOARD_URL = os.environ.get('N8N_DASHBOARD_URL') or 'https://genaroroustan1.app.n8n.cloud/webhook/dashboard-data'
N8N_DASHBOARD_API_KEY = os.environ.get('N8N_DASHBOARD_API_KEY') or API_KEY
HR_USERNAME = os.environ.get('HR_USERNAME')
HR_PASSWORD = os.environ.get('HR_PASSWORD')

@app.route('/', methods=['GET'])
def status():
    return "🛡️ Proxy Listo", 200

# --- MANEJO DE LA API ---

@app.route('/enviar-prueba', methods=['POST'])
def proxy_n8n():
    try:
        data = request.json or {}

        keys = _build_dedup_keys(data)
        if keys:
            now = time.time()
            with _dedup_lock:
                _purge_expired_locked(now)
                for key, window in keys:
                    seen_at = _dedup_cache.get(key)
                    if seen_at is not None and (now - seen_at) <= window:
                        ced = data.get('cedula', '?')
                        sid = data.get('_submissionId', '?')
                        print(f"[PROXY] Duplicado ignorado por {key} - cedula: {ced} sid: {sid}", flush=True)
                        return jsonify({"message": "duplicado ignorado", "matched": key}), 200
                # No coincide ninguna llave: registrar TODAS para futuros reenvíos.
                for key, _ in keys:
                    _dedup_cache[key] = now
                _save_dedup_cache_locked(_dedup_cache)

        if not N8N_URL:
            return jsonify({"error": "Falta URL en Secrets"}), 500

        # Lanzar envío a n8n en background y responder 200 inmediatamente
        # Esto evita que Replit reenvíe la request si el worker muere esperando
        def enviar_a_n8n(payload: dict) -> None:
            ced = payload.get('cedula', '?')
            sid = payload.get('_submissionId', '?')
            for attempt in range(1, 4):
                try:
                    print(f"[PROXY] Enviando a n8n (intento {attempt}/3) - cedula: {ced} sid: {sid}", flush=True)
                    res = requests.post(
                        N8N_URL,
                        json=payload,
                        headers={"Content-Type": "application/json", "x-api-key": API_KEY},
                        timeout=90,
                    )
                    res.raise_for_status()
                    print(f"[PROXY] n8n OK (intento {attempt}/3) - cedula: {ced} sid: {sid}", flush=True)
                    return
                except requests.exceptions.ConnectionError as e:
                    # n8n inalcanzable: NO procesó nada. Seguro reintentar.
                    print(f"[PROXY] n8n CONNECTION ERROR (intento {attempt}/3) - cedula: {ced} sid: {sid} - {e}", flush=True)
                    if attempt < 3:
                        time.sleep(30)
                    continue
                except requests.exceptions.Timeout as e:
                    # Timeout: n8n PUDO haber procesado. Reintentar = duplicado. Abandonar.
                    print(f"[PROXY] n8n TIMEOUT (NO se reintenta para evitar duplicado) - cedula: {ced} sid: {sid} - {e}", flush=True)
                    return
                except requests.exceptions.HTTPError as e:
                    # 4xx/5xx: n8n PUDO haber procesado parcialmente. NO reintentar.
                    code = e.response.status_code if e.response is not None else '?'
                    print(f"[PROXY] n8n HTTP {code} (NO se reintenta) - cedula: {ced} sid: {sid} - {e}", flush=True)
                    return
                except Exception as e:
                    print(f"[PROXY] n8n ERROR INESPERADO (NO se reintenta) - cedula: {ced} sid: {sid} - {e}", flush=True)
                    return
            print(f"[PROXY] n8n FALLO TRAS 3 INTENTOS DE CONEXIÓN - cedula: {ced} sid: {sid}", flush=True)

        threading.Thread(target=enviar_a_n8n, args=(data,), daemon=False).start()
        return jsonify({"message": "✅ Recibido"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/dashboard-data', methods=['GET'])
def proxy_dashboard_data():
    try:
        token = request.args.get('token', '')

        if not N8N_DASHBOARD_API_KEY:
            return jsonify({"error": "Falta X-API-KEY en Secrets"}), 500

        url = N8N_DASHBOARD_URL
        if token:
            url = f"{url}?token={token}"

        headers = {
            "Accept": "application/json",
            "X-API-KEY": N8N_DASHBOARD_API_KEY,
        }

        response = requests.get(url, headers=headers, timeout=20)
        try:
            return jsonify(response.json()), response.status_code
        except:
            return jsonify({"error": "Respuesta inválida desde n8n"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/hr/login', methods=['POST'])
def hr_login():
    try:
        if not HR_USERNAME or not HR_PASSWORD:
            return jsonify({"error": "Faltan credenciales RRHH en Secrets"}), 500

        data = request.json or {}
        username = str(data.get('username') or '').strip()
        password = str(data.get('password') or '')

        ok_user = hmac.compare_digest(username, HR_USERNAME)
        ok_pass = hmac.compare_digest(password, HR_PASSWORD)
        if not (ok_user and ok_pass):
            return jsonify({"ok": False}), 401

        return jsonify({"ok": True, "user": username}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
