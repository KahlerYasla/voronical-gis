from flask import Blueprint, request, jsonify
from flask_restx import Resource, Namespace, fields
from app.services.market_service import MarketService

# Create the Blueprint
market_bp = Blueprint('market', __name__)

# Create the Namespace
ns = Namespace('market', description='market entity presentation')

# Request models
get_all_market_request = ns.model('GetAllMarketRequest', {
    'territory_id': fields.Integer(required=True, 
                                   description='Returns all market entities in the territory with given Territory ID, ex: 1 for besiktas. Default: 1')
})

# Create an instance of the MarketService
market_service = MarketService()

@ns.route('/')
class MarketRoute(Resource):

    @ns.expect(get_all_market_request)
    def post(self):
        territory_id = request.args.get('territory_id', 1)
        
        # Call the market_service to retrieve all markets
        markets = market_service.get_all_markets(territory_id)
    
        return jsonify(markets)
