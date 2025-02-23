import React, { useState, useCallback } from 'react';
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
}

export const Question: React.FC<QuestionProps> = ({ question, onUpdate, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);
  const {
    type: questionType,
    id: questionId,
    questionInput: { value: questionInputValue = '', error: questionInputError = '' } = {},
    answerInput: { value: answerInputValue = '', error: answerInputError = '' } = {},
  } = question;

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    onUpdate(questionId, { type, options: undefined, answerInput: { value: '', error: '' } });
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate(questionId, {
      title: newTitle,
      questionInput: {
        value: newTitle,
        error: '',
      },
    });
  };

  const handleAnswerChange = (newTitle: string) => {
    onUpdate(questionId, {
      answerInput: {
        value: newTitle,
        error: '',
      },
    });
  };

  const handleTitleFocus = () => {
    setShowOptions(true);
  };

  const onDeleteQuestion = useCallback(() => {
    onDelete(questionId);
  }, [questionId]);

  return (
    <div className='question'>
      <div className='question-header'>
        <TextField
          id={`question-${questionId}`}
          value={questionInputValue}
          onChange={handleTitleChange}
          label='Question title *'
          onFocus={handleTitleFocus}
          error={questionInputError}
        />
        <div className='question-controls'>
          <button onClick={onDeleteQuestion} className='control-button'>
            <i className='fa fa-trash-o trash-icon'></i>
          </button>
        </div>
      </div>

      {showOptions && (
        <>
          <div className='input-container'>
            <select value={questionType} onChange={handleTypeChange} className='text-field question-type'>
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
            id={`answer-${questionId}`}
            value={answerInputValue}
            onChange={handleAnswerChange}
            label='Answer *'
            type={questionType}
            onFocus={() => {}}
            error={answerInputError}
          />
        </>
      )}
    </div>
  );
};
