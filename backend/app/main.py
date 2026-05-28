from fastapi import FastAPI
from app.core.config import settings
from app.utils.logger import get_logger
from app.api.routes import router


logger = get_logger()


app = FastAPI(
    title=settings.APP_NAME,
    description="Agentic Document Intelligence Engine with Strict Guardrails",
    version="1.0.0"
)


@app.on_event("startup")
async def startup_event():
    logger.info("Starting FastAPI server...")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down FastAPI server...")


app.include_router(router)