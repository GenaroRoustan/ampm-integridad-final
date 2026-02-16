import os
import hmac
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

N8N_URL = os.environ.get('N8N_WEBHOOK_URL')
API_KEY = os.environ.get('N8N_API_KEY')
HR_USERNAME = os.environ.get('HR_USERNAME')
HR_PASSWORD = os.environ.get('HR_PASSWORD')

@app.route('/', methods=['GET'])
def status():
    return "🛡️ Proxy Listo", 200

# --- MANEJO DE LA API ---

@app.route('/enviar-prueba', methods=['POST'])
def proxy_n8n():
    try:
        data = request.json
        headers = { "Content-Type": "application/json", "x-api-key": API_KEY }
        if not N8N_URL:
            return jsonify({"error": "Falta URL en Secrets"}), 500

        response = requests.post(N8N_URL, json=data, headers=headers)
        if response.status_code == 200:
            try:
                return jsonify(response.json()), 200
            except:
                return jsonify({"message": "✅ Datos recibidos correctamente"}), 200
        return jsonify({"error": "n8n error"}), response.status_code
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
