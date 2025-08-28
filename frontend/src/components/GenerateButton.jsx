import React, { useState } from 'react';
import axios from 'axios';
import { useCreateSurveyProvider } from '../component/CreateSurveyProvider';

const GenerateButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  
  const {
    setSurveyTitle,
    handleAddQuestion,
    handleTitleChange,
    handleOptionChange,
    handleAddOption,
  } = useCreateSurveyProvider();

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const description = prompt('Please describe the survey you want to generate:');
      if (!description) {
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:8000/api/surveys/generate', {
        description
      });

      setApiResponse(response.data);

      // Auto-fill the survey form
      setSurveyTitle(response.data.title);

      response.data.questions.forEach((question, questionIndex) => {
        handleAddQuestion(question.type);
        handleTitleChange(question.title, questionIndex);
        
        if (question.options) {
          question.options.forEach((option, optionIndex) => {
            if (optionIndex === 0) {
              handleOptionChange(option, questionIndex, 0);
            } else {
              handleAddOption(questionIndex);
              handleOptionChange(option, questionIndex, optionIndex);
            }
          });
        }
      });

    } catch (err) {
      setError(err.message);
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={handleGenerate}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? 'Generating...' : 'Generate Survey'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {apiResponse && (
        <div className="bg-gray-100 p-4 rounded shadow-sm">
          <h3 className="font-bold mb-2">Generated Survey:</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default GenerateButton;