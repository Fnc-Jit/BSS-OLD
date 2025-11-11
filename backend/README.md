# Neo-BBS Backend

💀 ASCII from the Afterlife - Backend API

## Setup

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your MongoDB URIs and API keys
```

4. Run development server:
```bash
uvicorn app.main:app --reload --port 8000
```

## Project Structure

```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Core configuration
│   ├── models/       # Pydantic models
│   ├── repositories/ # Database repositories
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   └── main.py       # FastAPI application
├── tests/            # Test files
└── requirements.txt  # Python dependencies
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
