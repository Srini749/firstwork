  import React, { useState, useMemo, useCallback } from 'react';
  import { useParams } from 'react-router-dom';
  import { FormAnswers, FormConfig, Question } from '../types/form';
  import { validators } from '../utils/validations';
  import './styles/styles.css';

  export const FormPreview: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const [answers, setAnswers] = useState<FormAnswers>(() => {
      const saved = localStorage.getItem(`${formId}`);
      return saved ? JSON.parse(saved).answers || [] : [];
    });

    const [formConfig, setFormConfig] = useState<FormConfig>(() => {
      const saved = localStorage.getItem(`${formId}`);
      return saved
        ? JSON.parse(saved)
        : {
            id: formId || `form-${Date.now()}`,
            title: 'Untitled Form',
            questions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
    });

    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        let updatedFormData = { ...formConfig, answers };
        const updatedErrors = formConfig.questions.reduce((acc, question) => {
          const validate = validators[question.type];
          if (validate) {
            const error = validate(answers[question.id], question);
            acc[question.id] = error || null;
          }
          return acc;
        }, {} as { [key: string]: string | null });

        setErrors(updatedErrors);
        if (Object.values(updatedErrors).every((error) => !error)) {
          updatedFormData.isSubmitted = true;
          localStorage.setItem(`${formId}`, JSON.stringify(updatedFormData));
        }
        setFormConfig(updatedFormData);
      },
      [answers, formConfig, formId],
    );

    const handleAnswerChange = useCallback((questionId: string, value: string | string[]) => {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: value,
      }));
    }, []);

    const renderQuestion = useCallback(
      (question: Question) => {
        const hasError = errors[question.id];
        const commonProps = {
          question,
          answers,
          hasError,
          onChange: handleAnswerChange,
          disabled: formConfig.isSubmitted || false,
        };

        switch (question.type) {
          case 'multiple-choice':
          case 'single-select':
            return <ChoiceQuestion key={question.id} {...commonProps} />;
          default:
            return <TextInputQuestion key={question.id} {...commonProps} />;
        }
      },
      [answers, errors, handleAnswer  Change],
    );

    const memoizedQuestions = useMemo(
      () => formConfig.questions.map((question) => renderQuestion(question)),
      [formConfig.questions, renderQuestion],
    );

    return (
      <div className='w-full p-6 bg-white rounded-lg shadow-sm'>
        <h1 className='left-align text-2xl font-bold mb-6'>{formConfig.title}</h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {memoizedQuestions}
          <button
            type='submit'
            className={`${formConfig.isSubmitted ? 'submitted-button': ''} preview-submit-button w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            disabled={formConfig.isSubmitted}
          >
            Submit
          </button>
        </form>
      </div>
    );
  };

  interface QuestionProps {
    question: Question;
    answers: FormAnswers;
    hasError: string | null;
    onChange: (questionId: string, value: string | string[]) => void;
    disabled: boolean;
  }

  const ChoiceQuestion: React.FC<QuestionProps> = ({ question, answers, hasError, onChange, disabled }) => {
    const isMultiple = question.type === 'multiple-choice';

    return (
      <div className='space-y-2'>
        {question.options?.map((option) => {
          const currentAnswers = (answers[question.id] as string[]) || [];
          const isChecked = isMultiple ? currentAnswers.includes(option.value) : answers[question.id] === option.value;

          return (
            <label key={option.value} className='flex items-center space-x-2'>
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name={isMultiple ? undefined : question.id}
                className='h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500'
                onChange={(e) => {
                  let newValue;
                  if (isMultiple) {
                    newValue = e.target.checked
                      ? [...currentAnswers, option.value]
                      : currentAnswers.filter((v) => v !== option.value);
                  } else {
                    newValue = option.value;
                  }
                  onChange(question.id, newValue);
                }}
                checked={isChecked}
                disabled={disabled}
              />
              <span className='text-gray-700'>{option.value}</span>
            </label>
          );
        })}
        {hasError && <div className='error-message'>{hasError}</div>}
      </div>
    );
  };

  const TextInputQuestion: React.FC<QuestionProps> = ({ question, answers, hasError, onChange, disabled }) => (
    <>
      <input
        type={question.type}
        onChange={(e) => onChange(question.id, e.target.value)}
        className={`${
          hasError ? 'error' : ''
        } w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        required={question.required}
        value={answers[question.id] || ''}
        disabled={disabled}
      />
      {hasError && <div className='error-message'>{hasError}</div>}
    </>
  );

  export default FormPreview;
