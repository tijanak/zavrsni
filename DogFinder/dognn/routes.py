from flask import request, jsonify
from model.arcface import ArcFace
from model.model import Model
from data.image_loader import ImageLoader
import json
from model.similarity import cosine_search
import io
from app import app
model = ArcFace()
imageLoader = ImageLoader()
from app import app
from flask import jsonify
from db.query import get_post, get_images_from_posts, get_post_images,get_opposite_posts,get_posts_with_ids,insert_dog_face,get_embeddings_for_post,find_recommended,get_all_posts
from preprocessing.preprocessing import process_image
from PIL import Image
import numpy as np
import cv2
@app.route('/matches/<int:post_id>', methods=['GET'])
def get_recommendations(post_id):
  try:
    result=find_recommended(post_id)
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

        dogs=process_image(image_bytes)
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
import os
from math import ceil, sqrt
@app.route('/generate_projector_files', methods=['GET'])
def generate_projector_files():
    try:
        root_dir = 'test dogs'  
        output_dir = 'projector_output'
        image_size = (64, 64) 

        os.makedirs(output_dir, exist_ok=True)

        embeddings = []
        labels = []
        sprite_images = []

        for dog_id in os.listdir(root_dir):
            dog_folder = os.path.join(root_dir, dog_id)
            if not os.path.isdir(dog_folder):
                continue

            for dirpath, _, filenames in os.walk(dog_folder):
                for img_name in filenames:
                    if not img_name.lower().endswith(('.jpg', '.jpeg', '.png')):
                        continue

                    img_path = os.path.join(dirpath, img_name)

                    try:
                        with open(img_path, 'rb') as f:
                            image_bytes = f.read()
                        app.logger.warning(img_path)
                        dog_faces = process_image(image_bytes)

                        for face in dog_faces:
                            tensor = model.predict(imageLoader.load_img(face))
                            tensor = tensor.cpu().detach().numpy()  
                            embeddings.append(np.squeeze(tensor))
                            labels.append(dog_id)

                            face_img = Image.open(face) if isinstance(face, str) else Image.fromarray(face)
                            face_img = face_img.convert("RGB").resize(image_size)
                            sprite_images.append(face_img)

                    except Exception as e:
                        app.logger.warning(f"Failed to process {img_path}: {e}")

        if not embeddings:
            return jsonify({"error": "No dog faces found in dataset."}), 400

        np.savetxt(os.path.join(output_dir, 'embeddings.tsv'), embeddings, delimiter='\t')

        with open(os.path.join(output_dir, 'metadata.tsv'), 'w') as f:
            for label in labels:
                f.write(f"{label}\n")

        def create_sprite(images, image_size, out_path):
            grid_size = ceil(sqrt(len(images)))
            sprite_image = Image.new('RGB', (grid_size * image_size[0], grid_size * image_size[1]), (255, 255, 255))

            for idx, img in enumerate(images):
                row = idx // grid_size
                col = idx % grid_size
                sprite_image.paste(img, (col * image_size[0], row * image_size[1]))

            sprite_image.save(out_path)

        create_sprite(sprite_images, image_size, os.path.join(output_dir, 'sprite.png'))

        return jsonify({
            "status": "success",
            "message": f"Projector files generated in {output_dir}",
            "embeddings_count": len(embeddings)
        }), 200

    except Exception as e:
        app.logger.error(f"Failed to generate projector files: {e}")
        return jsonify({"error": str(e)}), 500
import csv
@app.route('/calculate_topk',methods=['GET'])
def calculate_topk():
    try:
        posts=get_all_posts()
        topk=[0,0,0,0,0]
        num_posts=0
        details = []
        for post in posts:
            if "-" in post.description:
                continue
            num_posts+=1
            matches=find_recommended(post.id)

            
            match_index = None
            for i in range(min(5,len(matches))):
                if matches[i]['description']==post.description:
                    match_index = i
                    break
            if match_index is not None:
                for j in range(match_index, 5):
                    topk[j] += 1
            details.append({
                'post_id': post.id,
                'label': post.description,
                'match_index': match_index,
                'recommended_ids': [m['id'] for m in matches],
                'recommended_labels':[m['description'].split(' - ')[0] for m in matches]
            })
        for i in range(5):
            topk[i]=(topk[i]/num_posts)*100
        with open('topk_results.csv', mode='w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['post_id', 'label', 'match_index', 'recommended_ids', 'recommended_labels']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for item in details:
                writer.writerow({
                    'post_id': item['post_id'],
                    'label': item['label'],
                    'match_index': item['match_index'] if item['match_index'] is not None else '',
                    'recommended_ids': ', '.join(str(id) for id in item['recommended_ids']),
                    'recommended_labels': ', '.join(item['recommended_labels'])
                })

            writer.writerow({})

            writer.writerow({
                'post_id': 'TOP-K Accuracy (%)',
                'label': '',
                'match_index': '',
                'recommended_ids': ', '.join([f'Top-{i+1}: {topk[i]:.2f}%' for i in range(5)]),
                'recommended_labels': ''
            })
        return jsonify({
            'topk':topk,
            'num_posts':num_posts/2,
            'details': details
        })
    except Exception as e:
        return jsonify({'error':str(e)}),400