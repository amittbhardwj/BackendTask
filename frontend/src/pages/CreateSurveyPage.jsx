import React from "react";
import DashboardLayout from "../component/DashboardLayout";
import CreateSurvey from "../component/CreateSurvey";
import CreateSurveySidebar from "../component/CreateSurveySidebar";
import Header from "../component/Header";
import GenerateButton from "../components/GenerateButton";
import { useCreateSurveyProvider } from "../component/CreateSurveyProvider";

const CreateSurveyPage = ({ surveySeriesId = "defaultId" }) => {
  const {
    questions,
    handleAddQuestion,
    handleDeleteQuestion,
    handleTitleChange,
    handleQuestionTypeChange,
    handleOptionChange,
    handleAddOption,
    setSurveyTitle, // Verify this is properly destructured
    surveyTitle,
    surveyDescription,
  } = useCreateSurveyProvider();

  const handleSurveyGenerated = (survey) => {
    try {
      // Set survey title
      if (setSurveyTitle) {
        setSurveyTitle(survey.title);
      }

      // Clear existing questions
      if (questions && handleDeleteQuestion) {
        questions.forEach((_, index) => handleDeleteQuestion(index));
      }

      // Add generated questions
      if (survey.questions && handleAddQuestion) {
        survey.questions.forEach((question) => {
          handleAddQuestion(question.type);
          const questionIndex = questions.length - 1;

          if (handleTitleChange) {
            handleTitleChange(question.title, questionIndex);
          }

          if (question.options && handleOptionChange && handleAddOption) {
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
      }
    } catch (error) {
      console.error("Error handling survey generation:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="lg:min-h-[90px]">
          <Header>
            <h2 className="text-[26px] font-switzerMedium text-primary">
              Create a New Survey
            </h2>
          </Header>
        </div>
        <div className="flex grow w-full overflow-hidden h-full">
          <div className="grow p-3 sm:p-2 w-full overflow-auto h-[calc(100vh-164px)] sm:h-[calc(100vh-192px)] md:h-[calc(100vh-192px)] lg:h-[calc(100vh-148px)] xl:h-full scrollbar-style">
            <div className="block lg:hidden">
              <CreateSurveySidebar surveySeriesId={surveySeriesId} />
            </div>
            <CreateSurvey />
          </div>
          <div className="hidden lg:block min-w-[280px] p-3 max-w-[280px] overflow-auto scrollbar-style h-[calc(100vh-89px)]">
            <CreateSurveySidebar surveySeriesId={surveySeriesId} />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <GenerateButton onSurveyGenerated={handleSurveyGenerated} />
          {/* ...existing JSX... */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateSurveyPage;
