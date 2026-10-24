from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.app.services.db import DatabaseManager
from backend.app.routes import auth_bp, products_bp, orders_bp, admin_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend requests
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Initialize Database
    with app.app_context():
        DatabaseManager.get_db()

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_bp)

    # Health check route
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "mock_mode": DatabaseManager.is_mock(),
            "service": "ShopHub E-Commerce Backend API"
        }), 200

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "API endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"success": False, "message": "Internal server error"}), 500

    return app
