import React, { useState } from 'react';
import { FormConfig, Question } from '../types/form';
import { useParams } from 'react-router-dom';

// Define the shape of our answers object
interface FormAnswers {
  [key: string]: string | string[];
}

export const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [formConfig, setFormConfig] = useState(() => {
    const saved = localStorage.getItem(`form_${formId || 'draft'}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      id: formId || `form-${Date.now()}`,
      title: 'Untitled Form',
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(answers);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className='space-y-2'>
            {question.options?.map((option) => (
              <label key={option.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500'
                  onChange={(e) => {
                    const currentAnswers = (answers[question.id] as string[]) || [];
                    setAnswers({
                      ...answers,
                      [question.id]: e.target.checked
                        ? [...currentAnswers, option.value]
                        : currentAnswers.filter((v) => v !== option.value),
                    });
                  }}
                />
                <span className='text-gray-700'>{option.value}</span>
              </label>
            ))}
          </div>
        );

      case 'single-select':
        return (
          <div className='space-y-2'>
            {question.options?.map((option) => (
              <label key={option.value} className='flex items-center space-x-2'>
                <input
                  type='radio'
                  name={question.id}
                  className='h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500'
                  onChange={() => {
                    setAnswers({
                      ...answers,
                      [question.id]: option.value,
                    });
                  }}
                />
                <span className='text-gray-700'>{option.value}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type='text'
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            required={question.required}
          />
        );
    }
  };

  return (
    <div className='w-full p-6 bg-white rounded-lg shadow-sm'>
      <h1 className='text-2xl font-bold mb-6'>{formConfig.title}</h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {formConfig.questions.map((question: Question) => (
          <div key={question.id} className='space-y-2 bg-white rounded-lg p-4 shadow-sm'>
            <label className='block font-medium text-gray-700'>
              {question.title}
              {question.required && <span className='text-red-500 ml-1'>*</span>}
            </label>
            {renderQuestion(question)}
          </div>
        ))}

        <button
          type='submit'
          className='w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPreview;
