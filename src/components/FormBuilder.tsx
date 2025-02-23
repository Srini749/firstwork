import React from 'react';
import { Question } from './Question';
import useFormConfig from '../utils/useFormHook';

export const FormBuilder: React.FC = () => {
  const { formConfig, isSaving, dots, addQuestion, updateQuestion, deleteQuestion, handleFormSubmit } = useFormConfig();

  return (
    <form onSubmit={handleFormSubmit} className='form-builder'>
      <div className='form-header'>
        <h1>{formConfig.title}</h1>
      </div>

      <div className='questions-container'>
        {formConfig.questions.map((question) => (
          <Question key={question.id} question={question} onUpdate={updateQuestion} onDelete={deleteQuestion} />
        ))}
      </div>

      <button type='button' onClick={addQuestion} className='add-question'>
        + Add Question
      </button>
      <button type='submit' className='submit-button'>
        {isSaving ? `Saving${dots}` : 'Save'}
      </button>
    </form>
  );
};

export default FormBuilder;
