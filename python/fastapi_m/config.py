import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    SENTRY_DSN = os.getenv('SENTRY_DSN')
