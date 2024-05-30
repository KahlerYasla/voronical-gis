from flask import Blueprint, request, jsonify
from flask_restx import Resource, Namespace, fields
from app.services.navigation_service import NavigationService

# Create the Blueprint
navigation_bp = Blueprint('navigation', __name__)

# Create the Namespace
ns = Namespace('navigation', description='navigation functionalities')

# Request models
get_shortest_path_request = ns.model('GetShortestPathRequest', {
    'startLocationYX': fields.List(fields.Float, required=True,
                                    description='The starting location in the format [latitude, longitude]'),
    'endMarketId': fields.Integer(required=True, 
                                    description='The ID of the market where the navigation ends')
})

# Create an instance of the NavigationService
navigation_service = NavigationService()