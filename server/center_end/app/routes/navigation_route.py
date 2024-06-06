from flask import Blueprint, request, jsonify
from flask_restx import Resource, Namespace, fields
from app.services.navigation_service import NavigationService
from app.utils.logger import Logger

# Create the Blueprint
navigation_bp = Blueprint('navigation', __name__)

# Create the Namespace
ns = Namespace('navigation', description='navigation functionalities')

# Request models
get_shortest_path_request = ns.model('GetShortestPathRequest', {
    'from': fields.String(required=True, description='The starting point of the path'),
    'to': fields.String(required=True, description='The destination point of the path')
})

get_nearest_market_request = ns.model('GetNearestMarketRequest', {
    'from': fields.String(required=True, description='The starting point of the path'),
})


# Create an instance of the NavigationService
navigation_service = NavigationService()

@ns.route('/shortest-path')
class NavigationRoute(Resource):
    @ns.expect(get_shortest_path_request)
    def post(self):
        # Get the request body
        start = request.get_json().get('from')
        end = request.get_json().get('to')

        # Call the navigation_service to find the shortest path
        path = navigation_service.get_shortest_path(start, end)

        return jsonify(path)
    

@ns.route('/nearest-market')
class NavigationRoute(Resource):
    @ns.expect(get_nearest_market_request)
    def post(self):
        # Get the request body
        start = request.get_json().get('from')

        # find the nearest market
        end = None

        # Call the navigation_service to find the shortest path
        path = navigation_service.get_shortest_path(start, end)

        return jsonify(path)
    

@ns.route('/voronoi')
class NavigationRoute(Resource):
    def get(self):
        # Call the navigation_service to get the voronoi diagram
        voronoi = navigation_service.get_voronoi_diagram()

        return jsonify(voronoi)
    