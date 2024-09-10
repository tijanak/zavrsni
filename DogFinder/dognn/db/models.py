from app import db

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    surname = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone_number = db.Column(db.String, nullable=False)

    posts = db.relationship('Post', back_populates='creator')

class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    body = db.Column(db.Text, nullable=False)
    looking_for = db.Column(db.Boolean, nullable=False)
    creator_id = db.Column('creatorId',db.Integer, db.ForeignKey('user.id'))

    creator = db.relationship('User', back_populates='posts')

    images = db.relationship('Image', back_populates='post')

class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    fileName = db.Column(db.String, nullable=False)
    vector = db.Column(db.JSON, nullable=False)
    post_id = db.Column('postId',db.Integer, db.ForeignKey('post.id'))

    post = db.relationship('Post', back_populates='images')
