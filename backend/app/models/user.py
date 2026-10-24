from datetime import datetime, timezone
import re

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

class UserModel:
    @staticmethod
    def validate_registration(data):
        errors = {}
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not name or len(name) < 2:
            errors["name"] = "Full name must be at least 2 characters long."
        if not email or not re.match(EMAIL_REGEX, email):
            errors["email"] = "Please enter a valid email address."
        if not password or len(password) < 6:
            errors["password"] = "Password must be at least 6 characters long."

        return errors

    @staticmethod
    def create_document(name, email, hashed_password, role="customer"):
        return {
            "name": name.strip(),
            "email": email.strip().lower(),
            "password": hashed_password,
            "role": role if role in ["customer", "admin"] else "customer",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
