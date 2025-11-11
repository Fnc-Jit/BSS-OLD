from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import db_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - startup and shutdown."""
    # Startup: Connect to databases
    await db_manager.connect()
    print("💀 Connected to MongoDB Atlas clusters")
    print("   - Crypt cluster: Ready")
    print("   - Parlor cluster: Ready")
    print("   - Comedy Night cluster: Ready")
    
    yield
    
    # Shutdown: Close database connections
    await db_manager.close()
    print("👻 Database connections closed")


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
