import sentry_sdk
from fastapi import FastAPI
from ..fastapi_m import config

settings = config.Settings()
sentry_sdk.init(dsn=settings.SENTRY_DSN,traces_sample_rate=0.05)

app = FastAPI()

@app.get('/sentry-debug')
async def tragger_error():
    division_by_zero = 1 / 0