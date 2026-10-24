from flask import Blueprint, request
from backend.app.services.db import get_db, persist_state
from backend.app.models.user import UserModel
from backend.app.utils.auth_helper import hash_password, verify_password, generate_jwt
from backend.app.utils.serializers import serialize_doc
from backend.app.utils.responses import success_response, error_response
from backend.app.middleware.auth import token_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    errors = UserModel.validate_registration(data)
    if errors:
        return error_response("Validation error", 400, errors)

    db = get_db()
    email = data.get("email", "").strip().lower()

    existing_user = db.users.find_one({"email": email})
    if existing_user:
        return error_response("An account with this email address already exists.", 409)

    hashed_pw = hash_password(data.get("password"))
    role = data.get("role", "customer")
    # For security: only permit 'admin' if explicit registration key or first seed, default to customer
    if role != "admin":
        role = "customer"

    new_user = UserModel.create_document(
        name=data.get("name"),
        email=email,
        hashed_password=hashed_pw,
        role=role
    )
    result = db.users.insert_one(new_user)
    user_id = str(result.inserted_id)
    persist_state()

    token = generate_jwt(user_id=user_id, email=email, role=role, name=data.get("name"))
    user_data = serialize_doc(new_user, hide_password=True)
    user_data["id"] = user_id

    return success_response({
        "user": user_data,
        "token": token
    }, "Registration successful", 201)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return error_response("Email and password are required.", 400)

    db = get_db()
    user = db.users.find_one({"email": email})
    if not user:
        return error_response("Invalid email or password.", 401)

    if not verify_password(user.get("password", ""), password):
        return error_response("Invalid email or password.", 401)

    user_id = str(user.get("_id"))
    token = generate_jwt(
        user_id=user_id,
        email=user.get("email"),
        role=user.get("role", "customer"),
        name=user.get("name", "")
    )

    user_data = serialize_doc(user, hide_password=True)

    return success_response({
        "user": user_data,
        "token": token
    }, "Login successful", 200)

@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    return success_response({"user": current_user}, "User retrieved successfully")
