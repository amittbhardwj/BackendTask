from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from .database import engine, get_db  # Make sure to import engine
from . import models, schemas, services
from .config import settings
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    filename='survey_api.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Survey Generator API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/surveys/generate", response_model=schemas.SurveyResponse)
@limiter.limit(f"{settings.RATE_LIMIT}/hour")
async def generate_survey(
    request: Request,  # Must be the first parameter for rate limiting
    survey_request: schemas.SurveyRequest,
    db: Session = Depends(get_db)
):
    try:
        # Check if survey already exists
        existing_survey = db.query(models.Survey).filter(
            models.Survey.description == survey_request.description
        ).first()
        
        if existing_survey:
            return existing_survey.generated_survey
        
        # Generate new survey using Gemini
        survey = await services.generate_survey(survey_request.description)
        
        # Save to database
        db_survey = models.Survey(
            description=survey_request.description,
            generated_survey=survey.dict()
        )
        db.add(db_survey)
        db.commit()
        
        return survey
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/surveys/{survey_id}", response_model=schemas.SurveyInDB)
async def get_survey(
    survey_id: int,
    db: Session = Depends(get_db)
):
    survey = db.query(models.Survey).filter(models.Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey