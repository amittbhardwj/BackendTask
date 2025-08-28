import React from "react";
import { useCreateSurveyProvider } from "./CreateSurveyProvider";

const CreateSurveySidebar = ({ surveySeriesId }) => {
  const {
    surveyTitle,
    surveyDescription,
    questions
  } = useCreateSurveyProvider();

  // Safely handle potentially undefined values
  const title = surveyTitle || '';
  const description = surveyDescription || '';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Survey Details</h3>
          <p className="text-sm text-gray-600">Title: {title.trim()}</p>
          <p className="text-sm text-gray-600">Description: {description.trim()}</p>
        </div>
        <div>
          <h4 className="text-md font-medium">Questions: {questions?.length || 0}</h4>
        </div>
      </div>
    </div>
  );
};

export default CreateSurveySidebar;
