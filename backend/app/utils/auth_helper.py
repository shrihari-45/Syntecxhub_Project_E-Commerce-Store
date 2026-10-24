import jwt
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from backend.config import Config

def hash_password(password: str) -> str:
    """Securely hash a password using pbkdf2:sha256."""
    return generate_password_hash(password, method="pbkdf2:sha256")

def verify_password(hashed_password: str, plain_password: str) -> bool:
    """Verify a plain password against the stored hash."""
    return check_password_hash(hashed_password, plain_password)

def generate_jwt(user_id: str, email: str, role: str = "customer", name: str = "") -> str:
    """Generate a JWT token with user payload and expiration."""
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "name": name,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=Config.JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

def decode_jwt(token: str) -> dict:
    """Decode and validate a JWT token."""
    return jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
