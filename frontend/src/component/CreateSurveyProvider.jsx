import React, { createContext, useContext, useState } from 'react';

const CreateSurveyContext = createContext();

export const CreateSurveyProviderMock = ({ children }) => {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const value = {
    surveyTitle,
    surveyDescription,
    setSurveyTitle,
    setSurveyDescription,
    questions,
    selectedOptions,
    handleAddQuestion: (type) => {
      const newQuestion = {
        type: type || 'singleChoice',
        title: '',
        options: [],
        id: Date.now().toString()
      };
      setQuestions([...questions, newQuestion]);
      setSelectedOptions(prev => ({
        ...prev,
        [newQuestion.id]: []
      }));
    },
    handleDeleteQuestion: (index) => {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    },
    handleTitleChange: (title, index) => {
      const newQuestions = [...questions];
      if (newQuestions[index]) {
        newQuestions[index].title = title || '';
        setQuestions(newQuestions);
      }
    },
    handleQuestionTypeChange: (type, index) => {
      const newQuestions = [...questions];
      if (newQuestions[index]) {
        newQuestions[index].type = type || 'singleChoice';
        newQuestions[index].options = newQuestions[index].options || [];
        // Reset selected options when changing type
        setSelectedOptions(prev => ({
          ...prev,
          [newQuestions[index].id]: []
        }));
        setQuestions(newQuestions);
      }
    },
    handleOptionChange: (option, questionIndex, optionIndex) => {
      const newQuestions = [...questions];
      if (newQuestions[questionIndex]) {
        newQuestions[questionIndex].options = newQuestions[questionIndex].options || [];
        newQuestions[questionIndex].options[optionIndex] = option || '';
        setQuestions(newQuestions);
      }
    },
    handleAddOption: (questionIndex) => {
      const newQuestions = [...questions];
      if (newQuestions[questionIndex]) {
        newQuestions[questionIndex].options = newQuestions[questionIndex].options || [];
        newQuestions[questionIndex].options.push('');
        setQuestions(newQuestions);
      }
    },
    handleOptionSelect: (questionId, option, multiple = false) => {
      setSelectedOptions(prev => {
        if (multiple) {
          const current = prev[questionId] || [];
          return {
            ...prev,
            [questionId]: current.includes(option)
              ? current.filter(opt => opt !== option)
              : [...current, option]
          };
        }
        return {
          ...prev,
          [questionId]: [option]
        };
      });
    }
  };

  return (
    <CreateSurveyContext.Provider value={value}>
      {children}
    </CreateSurveyContext.Provider>
  );
};

export const useCreateSurveyProvider = () => {
  const context = useContext(CreateSurveyContext);
  if (!context) {
    throw new Error('useCreateSurveyProvider must be used within a CreateSurveyProvider');
  }
  return context;
};
