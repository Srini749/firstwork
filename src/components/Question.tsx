import React, { useState, useEffect } from 'react';
import { Question as QuestionType } from '../types/form';
import './styles/styles.css';
import TextField from './TextField';
import 'font-awesome/css/font-awesome.min.css';
import './styles/textfieldStyles.css';
import 'react-datepicker/dist/react-datepicker.css';

interface QuestionProps {
  question: QuestionType;
  onUpdate: (id: string, updates: Partial<QuestionType>) => void;
  onDelete: (id: string) => void;
  onAnswerChange: (id: string, answer: string) => void;
  answer: string;
}

export const Question: React.FC<QuestionProps> = ({ question, onUpdate, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    onUpdate(question.id, { type, options: undefined, answerInput: { value: '', error: '' } });
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate(question.id, {
      title: newTitle,
      questionInput: {
        value: newTitle,
        error: '',
      },
    });
  };

  const handleAnswerChange = (newTitle: string) => {
    onUpdate(question.id, {
      answerInput: {
        value: newTitle,
        error: '',
      },
    });
  };

  const handleTitleFocus = () => {
    setShowOptions(true);
  };

  return (
    <div className='question'>
      <div className='question-header'>
        <TextField
          id={`question-${question.id}`}
          value={question.title}
          onChange={handleTitleChange}
          label='Question title *'
          onFocus={handleTitleFocus}
          error={question.questionInput.error}
        />
        <div className='question-controls'>
          <button onClick={() => onDelete(question.id)} className='control-button'>
            <i className='fa fa-trash-o trash-icon'></i>
          </button>
        </div>
      </div>

      {showOptions && (
        <>
          <div className='input-container'>
            <select value={question.type} onChange={handleTypeChange} className='text-field question-type'>
              <option value='short-text'>Short Text</option>
              <option value='long-text'>Long Text</option>
              <option value='number'>Number</option>
              <option value='email'>Email</option>
              <option value='phone'>Phone</option>
              <option value='date'>Date</option>
            </select>
            <label className='placeholder-label'>Type *</label>
          </div>
          <TextField
            id={`answer-${question.id}`}
            value={question.answerInput.value}
            onChange={handleAnswerChange}
            label='Answer *'
            type={question.type}
            onFocus={() => {}}
            error={question.answerInput.error}
          />
        </>
      )}
    </div>
  );
};
