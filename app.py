from flask import Flask

from flask_mongoalchemy import MongoAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['MONGOALCHEMY_DATABASE'] = 'library'
CORS(app)
db = MongoAlchemy(app)
