import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_MODEL = os.getenv("MODEL_PATH", str(BASE_DIR / "app" / "models" / "best.pt"))

class Settings:
    MODEL_PATH = os.getenv("MODEL_PATH", DEFAULT_MODEL)
    # Add other settings like S3 bucket, AWS keys (but don't store secrets in repo)
    # AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    # AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

settings = Settings()
