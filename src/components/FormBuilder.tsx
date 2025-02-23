import React, { useState, useEffect } from 'react';
import { FormConfig, Question as QuestionType } from '../types/form';
import './styles/styles.css';
import { Question } from './Question';
import { validateField } from '../utils/validations';
import { useError } from './ErrorProvider';

export const FormBuilder: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig>({
    id: 'default-form',
    title: 'My Form',
    questions: [
      {
        id: `q-${Date.now()}`,
        title: '',
        type: 'short-text',
        questionInput: {
          value: '',
          error: '',
        },
        answerInput: {
          value: '',
          error: '',
        },
      },
    ],
  });
  const [answers, setAnswers] = useState<any>({});

  const addQuestion = () => {
    const newQuestion: QuestionType = {
      id: `q-${Date.now()}`,
      title: '',
      type: 'short-text',
      questionInput: {
        value: '',
        error: '',
      },
      answerInput: {
        value: '',
        error: '',
      },
    };

    setFormConfig((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (id: string, updates: Partial<QuestionType>) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }));
  };

  const deleteQuestion = (id: string) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prevAnswers: any) => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFormConfig = { ...formConfig };

    updatedFormConfig.questions.forEach((question) => {
      const error = validateField(question.answerInput.value, question);

      if (error) {
        if (error.errorField === 'question') {
          question.questionInput.error = error.value;
        } else {
          question.answerInput.error = error.value;
        }
      }
    });

    const hasErrors = updatedFormConfig.questions.some(
      (q) => q.questionInput.error !== '' || q.answerInput.error !== '',
    );

    if (!hasErrors) {
      alert('Form submitted successfully!');
    } else {
      setFormConfig(updatedFormConfig);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className='form-builder'>
      <div className='form-header'>
        <h1>{formConfig.title}</h1>
      </div>

      <div className='questions-container'>
        {formConfig.questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
            onAnswerChange={handleAnswerChange}
            answer={answers[question.id] || ''}
          />
        ))}
      </div>

      <button type='button' onClick={addQuestion} className='add-question'>
        + Add Question
      </button>
      <button type='submit' className='submit-button'>
        Submit Form
      </button>
    </form>
  );
};
