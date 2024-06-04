from flask import Blueprint, request, jsonify
from flask_restx import Resource, Namespace, fields
from app.services.market_service import MarketService

# Create the Blueprint
market_bp = Blueprint('market', __name__)

# Create the Namespace
ns = Namespace('market', description='market entity presentation')

# Request models
get_all_market_request = ns.model('GetAllMarketRequest', {
    'territory_id': fields.Integer(required=False, 
                                   description='Returns all market entities in the territory with given Territory ID, ex: 1 for besiktas. Default: 1')
})

create_market_request = ns.model('CreateMarketRequest', {
    'name': fields.String(required=True, description='The name of the market'),
    'location': fields.String(required=True, description='The location of the market in the format [latitude,longitude]')
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
    

@ns.route('/create')
class CreateMarketRoute(Resource):
    @ns.expect(create_market_request)
    def post(self):
        # Get the request body
        name = request.get_json().get('name')
        location = request.get_json().get('location')

        # Call the market_service to create a new market
        market = market_service.create_market(name, location)

        print(market)
        
        return jsonify({'message': 'Market created successfully!'})