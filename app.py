import os
from flask import Flask
from flask import make_response, render_template

from datetime import datetime
from flask_restful import Resource, Api

app = Flask(__name__, 
            template_folder='./templates',
            static_folder='./static'
        )

api = Api(app)
class Welcome(Resource):
    def __init__(self) -> None:
        print("HelloWorld")
        pass
    
    def get(self):
        return make_response(render_template('Welcome.html')) 

class Cases(Resource):
    def __init__(self) -> None:
        pass
    
    def get(self):
        caseData = [1, 2]
        return make_response(render_template('learn.html', caseData = caseData )) 



api.add_resource(Welcome, '/')
api.add_resource(Cases, '/cases')
#if __name__ == "__main__":
#    app.run(debug=True, extra-files templates/index.html:static/styles.css. host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
#    app.run()
