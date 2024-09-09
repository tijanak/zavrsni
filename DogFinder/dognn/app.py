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
@app.route('/db')
def db():
    response = json.dumps(database)
    return response
@app.route('/predict/',methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        image_bytes = file.read()
        tensor = arcface.predict(imageLoader.load_img(io.BytesIO(image_bytes)))
        data = tensor.tolist()
        response = json.dumps(data)
        return response
if __name__ == '__main__':
    app.run(debug=True,port=int(os.environ.get('NX_NN_PORT', 5000)))
