from flask import request, jsonify
from app import app
from PIL import Image
import numpy as np
import io
from preprocessing import process_image
@app.route('/')
def index():
  return 'Hello, World!'
@app.route('/process/', methods=['POST'])
def process():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        app.logger.info(f"Received file: {file.filename}, Size: {len(file.read())} bytes")

        file.seek(0)
        image_bytes = file.read()
        image=Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image_np = np.array(image)

        dogs = process_image(image_np)

        response = jsonify(dogs)
        return response
    except Exception as e:
        app.logger.error(e)
        return jsonify({"error": str(e)}), 500
