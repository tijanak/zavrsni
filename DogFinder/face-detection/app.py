from flask import Flask
from flask_cors import CORS
import os

os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'max_split_size_mb:128'
app = Flask(__name__)
CORS(app)


from routes import *
if __name__ == '__main__':
    app.run(debug=True,port=8080)


