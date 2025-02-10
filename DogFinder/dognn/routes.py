from flask import request, jsonify
from model.arcface import ArcFace
from model.model import Model
from data.image_loader import ImageLoader
import json
from model.similarity import cosine_search
import io
from app import app
model = Model()
imageLoader = ImageLoader()
from app import app
from flask import jsonify
from db.query import get_post, get_images_from_posts, get_post_images,get_opposite_posts,get_posts_with_ids,insert_dog_face,get_embeddings_for_post,find_recommended
from preprocessing.preprocessing import process_image
from PIL import Image
import numpy as np
import cv2
@app.route('/matches/<int:post_id>', methods=['GET'])
def get_recommendations(post_id):
  try:
    post=get_post(post_id)
    query_embeddings=get_embeddings_for_post(post_id)
    result=find_recommended(query_embeddings,not post.looking_for)

    ids = [item['id'] for item in result]
    posts=get_posts_with_ids(ids)
    sorted_posts = [post for id in ids for post in posts if post.id == id]
    result = [post.to_dict() for post in sorted_posts]
    return jsonify(result)

  except Exception as e:
        app.logger.error(e)
        return jsonify({"error": str(e)}), 500
@app.route('/recommend/<int:post_id>', methods=['GET'])
def get_similarities(post_id):
    try:
        post=get_post(post_id)
        post_vectors=get_post_images(post)
        opposite_posts=get_opposite_posts(post)
        database_vectors=get_images_from_posts(opposite_posts)
        if(len(post_vectors)==0 or len(database_vectors)==0):
            result=[]
        else:

            id_max_similarity = {}
            for vector in post_vectors:
                filtered_database_vectors = [v for v in database_vectors if len(v['vector']) == len(vector['vector'])]
                if(len(filtered_database_vectors)!=0):
                    id_max_similarity=find_similarities(filtered_database_vectors,vector['vector'],id_max_similarity)
            filtered_data = [{'id': vector_id, 'similarity': score}
                         for vector_id, score in id_max_similarity.items() ]

            sorted_data = sorted(filtered_data, key=lambda x: x['similarity'], reverse=True)

            top_3_data = sorted_data[:3]

            result = top_3_data
        ids = [item['id'] for item in result]
        posts=get_posts_with_ids(ids)
        sorted_posts = [post for id in ids for post in posts if post.id == id]
        result = [post.to_dict() for post in sorted_posts]
        return jsonify(result)
    except Exception as e:
        app.logger.error(e)
        return jsonify({"error": str(e)}), 500

#TODO - obrisi
@app.route('/db')
def db():
    return 'hello'
@app.route('/get_embeddings/<int:post_id>', methods=['GET'])
def get_embeddings(post_id):
    try:
        embeddings = get_embeddings_for_post(post_id)
        if embeddings:
            return jsonify({
                'status': 'success',
                'post_id': post_id,
                'embeddings': embeddings
            })
        else:
            return jsonify({
                'status': 'error',
                'message': f'No embeddings found for post_id {post_id}'
            }), 404
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
@app.route('/predict/<int:image_id>', methods=['POST'])
def predict(image_id):
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

        image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        dogs=process_image(image_np)
        tensors=[]
        for dog in dogs:
            tensor = model.predict(imageLoader.load_img(dog))
            insert_dog_face(image_id,tensor)
            tensors.append(tensor.tolist())
        response = json.dumps(tensors)
        return response
    except Exception as e:
        app.logger.error(e)
        return jsonify({"error": str(e)}), 500
