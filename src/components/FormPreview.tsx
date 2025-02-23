import React, { useState } from 'react';
import { FormAnswers, FormConfig, Question } from '../types/form';
import { useParams } from 'react-router-dom';
import { validators } from '../utils/validations';
import './styles/styles.css';

export const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [answers, setAnswers] = useState<FormAnswers>(() => {
    const saved = localStorage.getItem(`${formId}`);
    if (saved) {
      return JSON.parse(saved).answers || [];
    }
    return [];
  });
  const [formConfig, setFormConfig] = useState(() => {
    const saved = localStorage.getItem(`${formId}`);
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
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedFormData = { ...formConfig };
    updatedFormData.answers = answers;
    setFormConfig(updatedFormData);
    let hasErrors = false;
    let updatedErrors = { ...errors };
    updatedFormData.questions.forEach((question: Question) => {
      const validate = validators[question.type];
      if (validate) {
        const error = validate(answers[question.id], question);
        if (error) {
          hasErrors = true;
          updatedErrors[question.id] = error;
        } else {
          updatedErrors[question.id] = null;
        }
      }
    });
    if (Object.keys(errors).length !== 0) {
      setErrors(updatedErrors);
      return;
    }
    localStorage.setItem(`${formId}`, JSON.stringify(updatedFormData));
  };

  const renderQuestion = (question: Question) => {
    const hasError = errors[question.id];
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className='space-y-2'>
            {question.options?.map((option) => {
              const currentAnswers = (answers[question.id] as string[]) || [];
              const currentSelectedOptions = currentAnswers.filter((v) => v === option.value);
              return (
                <label key={option.value} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500'
                    onChange={(e) => {
                      setAnswers({
                        ...answers,
                        [question.id]: e.target.checked
                          ? [...currentAnswers, option.value]
                          : currentAnswers.filter((v) => v !== option.value),
                      });
                    }}
                    checked={currentSelectedOptions[0] === option.value}
                  />
                  <span className='text-gray-700'>{option.value}</span>
                </label>
              );
            })}
            {hasError && <div className='error-message'>{errors[question.id]}</div>}
          </div>
        );

      case 'single-select':
        return (
          <div className='space-y-2'>
            {question.options?.map((option) => {
              return (
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
                    checked={answers[question.id] === option.value}
                  />
                  <span className='text-gray-700'>{option.value}</span>
                </label>
              );
            })}
            {hasError && <div className='error-message'>{errors[question.id]}</div>}
          </div>
        );

      default:
        return (
          <>
            <input
              type={question.type}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
              className={`${
                hasError ? 'error' : ''
              } w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required={question.required}
              value={answers[question.id]}
            />
            {hasError && <div className='error-message'>{errors[question.id]}</div>}
          </>
        );
    }
  };

  return (
    <div className='w-full p-6 bg-white rounded-lg shadow-sm'>
      <h1 className='left-align text-2xl font-bold mb-6'>{formConfig.title}</h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {formConfig.questions.map((question: Question) => (
          <div key={question.id} className='space-y-2 bg-white rounded-lg p-4 shadow-sm'>
            <label className='left-align block font-medium text-gray-700'>
              {question.title}
              {question.required && <span className='text-red-500 ml-1'>*</span>}
            </label>
            {renderQuestion(question)}
          </div>
        ))}

        <button
          type='submit'
          className='preview-submit-button w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPreview;
