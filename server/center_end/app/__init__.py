import os
from flask import Flask

from app.configs.extensions import api
from app.configs.extensions import db

from app.routes.market_route import ns as market_ns
from app.routes.navigation_route import ns as navigation_ns

from app.utils.logger import Logger

def create_app():
    app = Flask(__name__)
 
    api.add_namespace(market_ns)
    api.add_namespace(navigation_ns)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://kahler:3755@localhost:5432/term_project'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    api.init_app(app)

    return app

if __name__ == '__main__':
    Logger.log('I love Voroni 🐶', 'blue')

    port = int(os.environ.get("PORT", 9300))
    app = create_app()
    app.run(host='0.0.0.0', port=port)
