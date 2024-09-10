from flask import Flask

from db.config import DATABASE_URI
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
CORS(app)
app.logger.info(DATABASE_URI)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
from routes import *
if __name__ == '__main__':
    app.run(debug=True,port=int(os.environ.get('NX_NN_PORT', 5000)))
