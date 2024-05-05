import os
import json

from flask import Flask
from flask import make_response, render_template

from datetime import datetime
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class Engine(Resource):
    def get(self):
        with open('./engine/gl_matrix.html', 'r') as f:
            html = f.read()
            return html
        

api.add_resource(Engine, '/GetEngine')

#if __name__ == "__main__":
#    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
#    app.run()
