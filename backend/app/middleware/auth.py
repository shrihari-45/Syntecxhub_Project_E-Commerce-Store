from functools import wraps
from flask import request
import jwt
from bson import ObjectId
from backend.app.services.db import get_db
from backend.app.utils.auth_helper import decode_jwt
from backend.app.utils.responses import error_response
from backend.app.utils.serializers import serialize_doc

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return error_response("Authorization token is missing", 401)

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return error_response("Invalid Authorization header format. Expected 'Bearer <token>'", 401)

        token = parts[1]
        try:
            payload = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return error_response("Authentication token has expired. Please log in again.", 401)
        except jwt.InvalidTokenError:
            return error_response("Invalid authentication token.", 401)
        except Exception as e:
            return error_response(f"Authentication failed: {str(e)}", 401)

        user_id = payload.get("sub")
        db = get_db()
        query = {}
        try:
            query = {"_id": ObjectId(user_id)}
        except Exception:
            query = {"_id": user_id}

        user = db.users.find_one(query)
        if not user:
            # Fallback search by email
            user = db.users.find_one({"email": payload.get("email")})

        if not user:
            return error_response("User account associated with token was not found", 401)

        current_user = serialize_doc(user, hide_password=True)
        return f(current_user, *args, **kwargs)

    return decorated

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user.get("role") != "admin":
            return error_response("Forbidden: Administrator access required", 403)
        return f(current_user, *args, **kwargs)

    return decorated
