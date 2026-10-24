import os
import json
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import mongomock
from bson import ObjectId
from backend.config import Config

logger = logging.getLogger(__name__)

class DatabaseManager:
    _instance = None
    _client = None
    _db = None
    _is_mock = False
    _backup_file = os.path.join(os.path.dirname(__file__), "..", "..", "data_store.json")

    @classmethod
    def get_db(cls):
        if cls._db is None:
            cls.initialize()
        return cls._db

    @classmethod
    def is_mock(cls):
        return cls._is_mock

    @classmethod
    def initialize(cls):
        # 1. Try real MongoDB
        try:
            mongo_uri = Config.MONGO_URI
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=1500)
            # Verify connection
            client.admin.command("ping")
            cls._client = client
            cls._db = client[Config.DB_NAME]
            cls._is_mock = False
            print(f"[MongoDB] Successfully connected to MongoDB at {mongo_uri}")
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            print(f"[MongoDB Notice] Local/remote MongoDB unreachable ({type(e).__name__}).")
            print("[MongoDB Notice] Activating high-performance Mock DB with disk persistence.")
            cls._client = mongomock.MongoClient()
            cls._db = cls._client[Config.DB_NAME]
            cls._is_mock = True
            cls._load_from_disk()

    @classmethod
    def _load_from_disk(cls):
        """Loads seeded/saved data from data_store.json into mongomock if exists."""
        if not os.path.exists(cls._backup_file):
            return
        try:
            with open(cls._backup_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            for collection_name, docs in data.items():
                col = cls._db[collection_name]
                col.delete_many({})
                for doc in docs:
                    # Convert string _id to ObjectId if it looks like one, or keep as string
                    if "_id" in doc and isinstance(doc["_id"], str) and len(doc["_id"]) == 24:
                        try:
                            doc["_id"] = ObjectId(doc["_id"])
                        except Exception:
                            pass
                    col.insert_one(doc)
            print(f"[MongoDB Notice] Restored collections from {cls._backup_file}")
        except Exception as err:
            logger.warning(f"Could not load data_store.json: {err}")

    @classmethod
    def persist_mock_state(cls):
        """Persists mongomock state to disk so changes survive server restarts in mock mode."""
        if not cls._is_mock:
            return
        try:
            os.makedirs(os.path.dirname(cls._backup_file), exist_ok=True)
            export_data = {}
            for col_name in ["users", "products", "orders"]:
                docs = list(cls._db[col_name].find({}))
                serializable_docs = []
                for d in docs:
                    doc_copy = dict(d)
                    if "_id" in doc_copy:
                        doc_copy["_id"] = str(doc_copy["_id"])
                    serializable_docs.append(doc_copy)
                export_data[col_name] = serializable_docs
            with open(cls._backup_file, "w", encoding="utf-8") as f:
                json.dump(export_data, f, indent=2, default=str)
        except Exception as err:
            logger.warning(f"Could not save to data_store.json: {err}")

def get_db():
    return DatabaseManager.get_db()

def persist_state():
    DatabaseManager.persist_mock_state()
