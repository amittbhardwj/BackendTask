# Backend Task

This task is designed to evaluate your backend skills, API design, code quality, architecture, and creativity. The goal is to augment the provided isolated frontend page with a fully working survey-generation feature.

To do so you are asked to create an AI-powered survey generator that transforms a user’s brief description into a fully structured questionnaire, covering diverse question types (multiple-choice, ratings, open-text, etc.) tailored to their needs.

## Description

You have been given an isolated version of one page of our frontend (React + TypeScript): [https://github.com/BoundaryAIRecruitment/BackendTask](https://github.com/BoundaryAIRecruitment/BackendTask)

Your job is to:

* **Add a “Generate Survey” button to the page:**

  * When clicked, it should prompt the user to enter a short survey description (e.g. “Customer satisfaction for an online store”).
  * Once submitted, the frontend should call your new backend endpoint.

* **Implement the backend (using Flask or FastAPI, your choice):**

  * **Route(s):**

    * A POST endpoint (e.g. `/api/surveys/generate`) that accepts the user’s description.
  * **Logic & Integration:**

    * Use the OpenAI API, or another LLM of your choice to generate a structured survey.
    * It is recommended that the output be JSON-structured (e.g. `{ "title": "...", "questions": [ { "type": "...", "text": "..." }, … ] }`).
  * **Storage:** save generated surveys for repeated prompts.

    * Save the input and output in a PostGreSQL database; if an input is the same, you should fetch it instead of generate it.
  * **Auto-fill:**

    * Return the generated JSON so the frontend can render the new survey form automatically.

# AI-Powered Survey Generator

A full-stack application that generates structured surveys from natural language descriptions using AI.

## Tech Stack

### Backend
- **FastAPI**: Chosen over Flask for:
  - Native async support
  - Automatic OpenAPI documentation
  - Better type hints and validation
  - Modern Python features
- **PostgreSQL**: For efficient caching and data persistence
- **Google Gemini API**: For AI-powered survey generation
- **SQLAlchemy**: For ORM and database management
- **Pydantic**: For data validation and settings management

### Frontend
- **React**: For building a dynamic user interface
- **Axios**: For API communication
- **TailwindCSS**: For styling

## Setup & Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd BackendTask
```

2. **Set up environment variables**
```bash
# Backend (.env)
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://postgres:postgres@localhost/survey_db
RATE_LIMIT=100

# Frontend (.env)
REACT_APP_API_URL=http://localhost:8000
```

3. **Using Docker (Recommended)**
```bash
docker compose up --build
```

4. **Manual Setup**

Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm start
```

## Features

### Core Implementation
- FastAPI backend with PostgreSQL integration
- AI-powered survey generation with Gemini API
- Caching mechanism for repeated requests
- React frontend with dynamic form generation

### Additional Features
- Rate limiting for API protection
- Error handling and logging
- Docker containerization
- API response caching
- Clean architecture with separation of concerns

## API Documentation

Access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure
```
BackendTask/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py        # Database models
│   │   ├── services.py      # Business logic
│   │   └── config.py        # Configuration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   └── package.json
└── docker-compose.yml
```

## Development

- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:3000
- PostgreSQL runs on localhost:5432

## Areas of Focus

1. **Architecture**
   - Clean code structure
   - Separation of concerns
   - Dependency injection

2. **Performance**
   - Database caching
   - Rate limiting
   - Efficient API responses

3. **Developer Experience**
   - Docker setup
   - Comprehensive documentation
   - Easy environment setup

4. **Security**
   - Environment variable management
   - API rate limiting
   - Error handling

## Future Improvements

- Add authentication
- Implement unit tests
- Add survey analytics
- Improve error handling
- Add input validation
