from db.init import db
from pgvector.sqlalchemy import Vector
# class User(db.Model):
#     __tablename__ = 'user'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String, nullable=False)
#     surname = db.Column(db.String, nullable=False)
#     password = db.Column(db.String, nullable=False)
#     email = db.Column(db.String, unique=True, nullable=False)
#     phone_number = db.Column(db.String, nullable=False)

#     posts = db.relationship('Post', back_populates='creator')

class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    looking_for = db.Column(db.Boolean, nullable=False)

    #creator_id = db.Column('creatorId',db.Integer, db.ForeignKey('user.id'))

    #creator = db.relationship('User', back_populates='posts')

    images = db.relationship('Image', back_populates='post')
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'looking_for': self.looking_for
        }



class DogFace(db.Model):
    __tablename__ = 'dog_faces'
    face_id = db.Column(db.Integer, primary_key=True)
    image_id = db.Column(db.Integer, db.ForeignKey('image.id', ondelete='CASCADE'))
    embedding = db.Column(Vector(512), nullable=False)
class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    fileName = db.Column(db.String, nullable=False)
    #vector = db.Column(db.JSON, nullable=False)
    post_id = db.Column('postId',db.Integer, db.ForeignKey('post.id'))
    dog_face = db.relationship(DogFace, backref="image", passive_deletes=True)
    post = db.relationship('Post', back_populates='images')


