import React from 'react';
import { Question } from '../types/form';

interface TextInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ question, value, onChange, error }) => {
  const inputType = {
    'short-text': 'text',
    'long-text': 'textarea',
    'email': 'email',
    'phone': 'tel',
    'number': 'number',
    'date': 'date',
    'multiple-choice': 'multiple-choice',
    'single-select': 'single-select',
  }[question.type] || 'text';

  return (
    <div className="question-input-container">
      {inputType === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-field textarea ${error ? 'error' : ''}`}
          required={question.required}
        />
      ) : (
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-field ${error ? 'error' : ''}`}
          required={question.required}
        />
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};