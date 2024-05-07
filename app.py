from typing import Any
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
            self.__matrix_libs = self.create_html_script_element(f)
        
        with open('./engine/webworkers/gameloop_manager.js', 'r') as f:
            self.__game_loop_manager = self.create_webworker(f, 'w_GameLoopManager');
            
        with open('./engine/app/app.js', 'r') as f:
            self.__APP = self.create_game_app(f);
    
    def __call__(self):
        return self.__matrix_libs + self.__game_loop_manager + self.__APP;
                  
    def create_html_script_element(self, x):
        return BeautifulSoup(x.read(), 'html.parser').prettify().replace('\"', "'").replace("\n", '').strip()
    
    def create_webworker(self, js_code, workerName):
        js_string = " <script>"
        js_string += " const workerString ="
        js_string += " `{}`".format(js_code.read())
        js_string += " if(window.Worker){{const {} = new Worker(workerString)}};</script> ".format(workerName)
        return js_string
    
    def create_game_app(self, js_code):
        js_string = " <script type='module' src={}></script> ".format(js_code.read())
        return js_string
   
    @property
    def external_libs(self):
        return self.__matrix_libs;
        
    @property
    def game_loop_manager(self):
        return self.__game_loop_manager
    
    @property
    def app(self):
        return self.__APP;
    
    
class Engine(Resource):
    def get(self):
        ENGINE = EngineResources()
        return ENGINE()
    
api.add_resource(Engine, '/GetEngine')

#if __name__ == "__main__":
#    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
#    app.run()
