import logging
from logging.handlers import RotatingFileHandler
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('hirotix-ai')
handler = RotatingFileHandler('ai_service.log', maxBytes=1000000, backupCount=3)
handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

# Load environment variables
basedir = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(basedir, '.env')
load_dotenv(env_path, override=True)

def create_app():
    """Application factory for the Hirotix AI Service."""
    app = Flask(__name__)
    CORS(app) # Enable CORS for all routes

    # Register Error Handlers
    from app.utils.error_handlers import register_error_handlers
    register_error_handlers(app)

    # Register Blueprints
    from app.routes import bp as api_bp
    app.register_blueprint(api_bp)

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Hirotix AI Service starting on port {port} with Threaded mode.")
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
