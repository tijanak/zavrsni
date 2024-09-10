
from db.models import Post
import json
from app import app
def get_post_images(post):
    result = []
    for image in post.images:
        vector = json.loads(image.vector) if isinstance(image.vector, str) else image.vector
        result.append({
                    "id": post.id,
                    "vector": vector
                })

    return result
def get_post(post_id):
    try:
        post = Post.query.get(post_id)
        return post
    except Exception as e:
        raise e
def get_opposite_post_images(post):
    try:
        if post is None:
            raise Exception({"error": "Post not found"})

        opposite_looking_for = not post.looking_for

        opposite_posts = Post.query.filter_by(looking_for=opposite_looking_for).all()

        result = []
        for opposite_post in opposite_posts:
            for image in get_post_images(opposite_post):
                result.append(image)
        
        return result

    except Exception as e:
        raise e
