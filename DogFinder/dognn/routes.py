from flask import request, jsonify
from model.arcface import ArcFace
from data.image_loader import ImageLoader
import json
from model.similarity import cosine_search
import io
from app import app
arcface = ArcFace()
imageLoader = ImageLoader()
# routes.py
from app import app
from flask import jsonify
from db.query import get_post, get_opposite_post_images, get_post_images
from model.similarity import find_similarities

@app.route('/matches/<int:post_id>', methods=['GET'])
def get_similarities(post_id):
    try:
        post=get_post(post_id)
        post_vectors=get_post_images(post)
        database_vectors=get_opposite_post_images(post)
        if(len(post_vectors)==0):
            result=[]
        else:
            result=find_similarities(database_vectors,post_vectors[0]['vector'])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        
        file.seek(0)  
        image_bytes = file.read()
        
        
        tensor = arcface.predict(imageLoader.load_img(io.BytesIO(image_bytes)))
        
        data = tensor.tolist()
        response = json.dumps(data)
        return response
    except Exception as e:
        app.logger.error(e)
        return jsonify({"error": str(e)}), 500