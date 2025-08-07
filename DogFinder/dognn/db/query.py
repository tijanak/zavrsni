
from db.models import Post,DogFace
from db.init import db
import json
from app import app
def get_post_images(post):
    result = []
    for image in post.images:
        vector = json.loads(image.vector) if isinstance(image.vector, str) else image.vector
        for v in vector:

            result.append({
                    "id": post.id,
                    "vector": v
                })

    return result
def get_post(post_id):
    try:
        post = Post.query.get(post_id)
        return post
    except Exception as e:
        raise e
def get_opposite_posts(post):
    try:
        if post is None:
            raise Exception({"error": "Post not found"})
        opposite_looking_for = not post.looking_for

        opposite_posts = Post.query.filter_by(looking_for=opposite_looking_for).all()
        return opposite_posts
    except Exception as e:
        raise e
def get_posts_with_ids(ids):
    try:
        posts = Post.query.filter(Post.id.in_(ids)).all()


        return posts
    except Exception as e:
        raise e
def get_images_from_posts(posts):
    try:
        result = []
        for post in posts:
            for image in get_post_images(post):
                result.append(image)

        return result

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
def cosine_sim_query(query_embeddings):
    if(len(query_embeddings)==0):
        return ""
    embedding_comparisons = ["(embedding <=> CAST( :embedding_{} AS Vector(512)))".format(i) for i in range(len(query_embeddings))]

    similarity_best = "GREATEST(" + ", ".join(embedding_comparisons) + ")"

    query = f"""
    SELECT * FROM (
    SELECT DISTINCT ON ("postId")
        "postId",
        {similarity_best} AS similarity
    FROM dog_faces
    JOIN image ON dog_faces.image_id = image.id
    JOIN post ON image."postId" = post.id
    WHERE post.looking_for = :looking_for_value
    GROUP BY "postId", dog_faces.embedding
    ORDER BY  "postId", similarity ASC
    ) A WHERE A.similarity > 0 ORDER BY similarity ASC LIMIT 5
    """
    return query
def euclidean_query(query_embeddings):
    embedding_comparisons = ["(embedding <-> CAST( :embedding_{} AS Vector(512)))".format(i) for i in range(len(query_embeddings))]

    similarity_best = "LEAST(" + ", ".join(embedding_comparisons) + ")"

    query = f"""
    SELECT * FROM (
    SELECT DISTINCT ON ("postId")
        "postId",
        {similarity_best} AS similarity
    FROM dog_faces
    JOIN image ON dog_faces.image_id = image.id
    JOIN post ON image."postId" = post.id
    WHERE post.looking_for = :looking_for_value
    GROUP BY "postId", dog_faces.embedding
    ORDER BY "postId", similarity ASC
    ) A ORDER BY similarity ASC LIMIT 5
    """
    return query

def find_recommended(query_embeddings, looking_for_value=True):
    query = cosine_sim_query(query_embeddings)
    if(len(query)==0):
        return []
    query_params = {'looking_for_value': looking_for_value}
    for i, embedding_text in enumerate(query_embeddings):
        embedding_list = json.loads(embedding_text)
        query_params[f"embedding_{i}"] = embedding_list

    results = db.session.execute(text(query), query_params).fetchall()

    return [{"id": row[0],"sim":row[1]} for row in results]
from sqlalchemy import text
def get_embeddings_for_post(post_id):
    query = """
    SELECT dog_faces.embedding
    FROM dog_faces
    JOIN image ON dog_faces.image_id = image.id
    WHERE image."postId" = :post_id
    """

    result = db.session.execute(text(query), {'post_id': post_id}).fetchall()

    embeddings = [row[0] for row in result]

    return embeddings
def insert_dog_face(image_id, embedding):
    try:
        dog_face = DogFace(image_id=image_id, embedding=embedding)
        db.session.add(dog_face)
        db.session.commit()
        return dog_face
    except Exception as e:
        db.session.rollback()
        raise e
