import React from 'react';
import { useFormBuilder } from '../utils/useFormHook';
import { Question } from './Question';
import { useParams } from 'react-router-dom';
import './styles/styles.css';

export const FormBuilder: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const {
    formConfig,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption,
    saveForm,
    previewForm,
    lastSaved,
    updateFormTitle,
    saving,
    errors,
  } = useFormBuilder(formId);

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <input
          type='text'
          value={formConfig.title}
          onChange={(e) => updateFormTitle(e.target.value)}
          className='text-2xl font-bold border-none focus:outline-none'
        />
        <div>
          <div className="element-row">
            {saving && <div className='loader'></div>}
            <p className='text-sm text-gray-500'>
              {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
            </p>
          </div>

          <button onClick={saveForm} className='save-form bg-blue-500 text-white px-4 py-2 rounded'>
            Save Form
          </button>
          {formConfig.questions.length > 0 && (
            <button onClick={previewForm} className='bg-blue-500 text-white px-4 py-2 rounded'>
              Preview
            </button>
          )}
        </div>
      </div>

      <div className='space-y-4'>
        {formConfig.questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
            onAddOption={addOption}
            onUpdateOption={updateOption}
            onDeleteOption={deleteOption}
            error={errors[question.id]}
          />
        ))}
      </div>

      <button
        onClick={addQuestion}
        className='mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50'
      >
        + Add Question
      </button>
    </div>
  );
};
