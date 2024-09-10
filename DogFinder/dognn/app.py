from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from data.image_loader import ImageLoader
import json
from model.similarity import cosine_search
import io
import logging

from model.arcface import ArcFace
app = Flask(__name__)
CORS(app)
arcface = ArcFace()
imageLoader = ImageLoader()
@app.route('/search',methods=['POST'])
def search():
    
    
    if request.is_json:
        data = request.json
        if 'query' in data and 'database' in data:
            query = data['query']
            database= data['database']
            if(len(database)==0):
                response={
                    'error': 'Database is empty'
                    }
            else:
                vectors = [entry['vector'] for entry in database]
                similarities= cosine_search(vectors,query)
                result= [{'id': entry['id'], 'similarity': float(similarities[index])} for index, entry in enumerate(database)]
                filtered_data = [item for item in result if item['similarity'] > 0.5]

                sorted_data = sorted(filtered_data, key=lambda x: x['similarity'], reverse=True)

                top_3_data = sorted_data[:3]

                response = json.dumps(top_3_data)
        else:
            response = {
                'error': 'Missing keys in request'
            }
    else:
        response = {
            'error': 'Request must be JSON'
        }

    
    return response
#TODO - obrisi
@app.route('/db')
def db():
    return 'hello'
@app.route('/predict/', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        app.logger.info(f"Received file: {file.filename}, Size: {len(file.read())} bytes")
        
        file.seek(0)  # Reset file pointer to the beginning
        image_bytes = file.read()
        
        # Create BytesIO object
        image_stream = io.BytesIO(image_bytes)
        
        app.logger.info('predict')
        # Try to open the image to validate it's a valid image file
        from PIL import Image
        image = Image.open(image_stream)
        image.verify()  # Validate the image file
        
        # Reset stream for further processing
        image_stream.seek(0)
        
        tensor = arcface.predict(imageLoader.load_img(io.BytesIO(image_bytes)))
        
        data = tensor.tolist()
        response = json.dumps(data)
        return response
    except Exception as e:
        app.logger.error(e)
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True,port=int(os.environ.get('NX_NN_PORT', 5000)))
