import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

N8N_URL = os.environ.get('N8N_WEBHOOK_URL')
API_KEY = os.environ.get('N8N_API_KEY')

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
