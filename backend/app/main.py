from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import db_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - startup and shutdown."""
    # Startup: Connect to databases
    await db_manager.connect()
    print("💀 Neo-BBS is waking up from the grave...")
    print("   🔗 Connected to Crypt cluster - spirits are gathering")
    print("   🔗 Connected to Parlor cluster - the séance begins")
    print("   🔗 Connected to Comedy Night cluster - ghosts are laughing")
    print("   ✨ All systems haunted and ready!")
    
    yield
    
    # Shutdown: Close database connections
    await db_manager.close()
    print("👻 The spirits have returned to rest... connections closed")


app = FastAPI(
    title="Neo-BBS API",
    description="ASCII from the Afterlife - A haunted BBS system",
    version="0.1.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "💀 Welcome to Neo-BBS: ASCII from the Afterlife 💀",
        "status": "haunted",
        "boards": ["crypt", "parlor", "comedy-night"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "alive... barely",
        "database": "connected to the afterlife"
    }
