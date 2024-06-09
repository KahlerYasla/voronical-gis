from flask import Blueprint, request, jsonify
from flask_restx import Resource, Namespace, fields
from app.services.auth_service import AuthService
from app.models.user import User

from app.utils.logger import Logger

# Create the Blueprint
auth_bp = Blueprint('auth', __name__)

# Create the Namespace
ns = Namespace('auth', description='auth entity presentation')

# Request models
login_request = ns.model('LoginRequest', {
    'userName': fields.String(required=True, description='The username of the user'),
    'password': fields.String(required=True, description='The password of the user'),
    'userRole': fields.String(required=True, description='The role of the user')
})

create_user_request = ns.model('CreateUserRequest', {
    'userName': fields.String(required=True, description='The username of the user'),
    'password': fields.String(required=True, description='The password of the user'),
    'userRole': fields.String(required=True, description='The role of the user')
})

# Create an instance of the AuthService
auth_service = AuthService()

@ns.route('/login')
class LoginRoute(Resource):
    @ns.expect(login_request)
    def post(self):
        # Get the request body
        username = request.get_json().get('userName')
        password = request.get_json().get('password')
        userRole = request.get_json().get('userRole')

        # Call the auth_service to login
        user: User = auth_service.login(username, password, userRole)

        Logger._("type of user: ", "b")
        print(type(user))

        Logger.break_line()
        Logger.log("returned User from login service: ", "r")
        print(user)

        if user:
            return jsonify(user.format_to_json())
        else:
            return jsonify({'message': 'User not found!'})
        

@ns.route('/create')
class CreateUserRoute(Resource):
    @ns.expect(create_user_request)
    def post(self):
        # Get the request body
        username = request.get_json().get('userName')
        password = request.get_json().get('password')
        userRole = request.get_json().get('userRole')

        # Call the auth_service to create a new user
        user = auth_service.create_user(username, password, userRole)

        return jsonify(user.format_to_json())
  