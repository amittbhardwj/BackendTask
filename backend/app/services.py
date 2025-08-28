import google.generativeai as genai
import json
from typing import Dict, Any
from . import schemas
from .config import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')  # Using the stable production model

async def clean_json_response(response_text: str) -> Dict[str, Any]:
    """Helper function to clean and parse JSON response"""
    response_text = response_text.strip()
    start_idx = response_text.find('{')
    end_idx = response_text.rfind('}') + 1
    if start_idx != -1 and end_idx != 0:
        response_text = response_text[start_idx:end_idx]
    return json.loads(response_text)

async def generate_survey(description: str) -> schemas.SurveyResponse:
    """
    Generate a survey using Google's Gemini model based on the user's description.
    """
    prompt = f"""Create a survey based on this description: {description}
    Respond ONLY with a JSON object in this exact format:
    {{
        "title": "<insert relevant title>",
        "questions": [
            {{
                "type": "<singleChoice|multipleChoice|openQuestion>",
                "title": "<question text>",
                "options": ["<option1>", "<option2>", ...]  // omit for openQuestion
            }}
        ]
    }}
    Include 3-5 relevant questions. Ensure valid JSON structure."""

    try:
        response = await model.generate_content_async(prompt)
        survey_dict = await clean_json_response(response.text)
        return schemas.SurveyResponse(**survey_dict)
    
    except json.JSONDecodeError as je:
        print(f"JSON Decode Error: {str(je)}")
        print(f"Raw response: {response.text}")
        raise Exception("Failed to parse Gemini response as JSON")
    except Exception as e:
        raise Exception(f"Failed to generate survey: {str(e)}")