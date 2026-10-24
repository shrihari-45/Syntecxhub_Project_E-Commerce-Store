import os
import sys

# Ensure backend root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app import create_app
from backend.config import Config

app = create_app(Config)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"[SERVER] Syntecxhub E-Commerce Server starting at http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=Config.DEBUG)
