import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "syntecxhub_jwt_secret_key_prod_2026_xyz")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ecommerce_db")
    DB_NAME = os.getenv("DB_NAME", "ecommerce_db")
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "72"))
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
