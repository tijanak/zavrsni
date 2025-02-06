from flask import Flask

from db.config import DATABASE_URI
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from db.init import db
os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'max_split_size_mb:128'
app = Flask(__name__)
CORS(app)
app.logger.info(DATABASE_URI)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.session.execute(text('CREATE EXTENSION IF NOT EXISTS vector'))
    db.session.commit()
    from db.models import *
    db.create_all()
    app.logger.info("Database created")

from routes import *
if __name__ == '__main__':
    app.run(debug=True,port=int(os.environ.get('NX_NN_PORT', 5000)))


