from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class SurveyRequest(BaseModel):
    description: str = Field(..., min_length=10, max_length=1000)
    
    @validator('description')
    def validate_description(cls, v):
        if not v.strip():
            raise ValueError('Description cannot be empty or whitespace')
        return v.strip()

class QuestionBase(BaseModel):
    type: str
    title: str
    options: Optional[List[str]] = None

class SurveyResponse(BaseModel):
    title: str
    questions: List[QuestionBase]

class SurveyInDB(BaseModel):
    id: int
    description: str
    generated_survey: SurveyResponse
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True