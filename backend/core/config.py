from dotenv import load_dotenv
import os


load_dotenv()

BLIZZARD_CLIENT_ID = os.getenv("BLIZZARD_CLIENT_ID")
BLIZZARD_CLIENT_SECRET = os.getenv("BLIZZARD_CLIENT_SECRET")
BLIZZARD_REGION = os.getenv("BLIZZARD_REGION")