from backend.app.routes.auth import auth_bp
from backend.app.routes.products import products_bp
from backend.app.routes.orders import orders_bp
from backend.app.routes.admin import admin_bp

__all__ = ["auth_bp", "products_bp", "orders_bp", "admin_bp"]
