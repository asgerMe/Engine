from bs4 import BeautifulSoup

from flask import Flask
from flask import make_response, render_template

from datetime import datetime
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class EngineResources:
    def __init__(self) -> None:
        with open('./engine/gl_matrix.html', 'r') as f:
            self.__matrix_libs = BeautifulSoup(f.read(), 'html.parser').prettify().replace('\"', "'").replace("\n", '')
            
    @property
    def external_libs(self):
        return self.__matrix_libs;
        
class Engine(Resource):
    def get(self):
        ENGINE = EngineResources()
       
        return ENGINE.external_libs
        

api.add_resource(Engine, '/GetEngine')

#if __name__ == "__main__":
#    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
#    app.run()
