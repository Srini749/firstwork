import React, { useCallback, useMemo } from 'react';
import { Question as QuestionType, QuestionType as QuestionTypes } from '../types/form';
import './styles/styles.css';

interface QuestionProps {
  question: QuestionType;
  onUpdate: (id: string, updates: Partial<QuestionType>) => void;
  onDelete: (id: string) => void;
  onAddOption: (questionId: string) => void;
  onUpdateOption: (questionId: string, optionId: string, value: string) => void;
  onDeleteOption: (questionId: string, optionId: string) => void;
  error: string | null,
}

const questionTypes = [
  { value: 'short-text', label: 'Short Text' },
  { value: 'long-text', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'single-select', label: 'Single Select' },
];

const validationFields: Record<QuestionTypes, string[]> = {
  'short-text': ['minLength', 'maxLength'],
  'long-text': ['minLength', 'maxLength'],
  number: ['min', 'max'],
  date: ['minDate', 'maxDate'],
  email: [],
  phone: [],
  'multiple-choice': [],
  'single-select': [],
};

export const Question: React.FC<QuestionProps> = ({
  question,
  onUpdate,
  onDelete,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  error,
}) => {
  const renderValidationFields = useMemo(() => {
    const fieldsToRender = validationFields[question.type];
    if (!fieldsToRender) return null;

    return (
      <div className='grid grid-cols-2 gap-4 mt-2'>
        {fieldsToRender.map((field) => (
          <div key={field}>
            <label className='left-align block text-sm text-gray-600 mb-1'>
              {field.replace(/([A-Z])/g, ' $1').toUpperCase()} (Optional)
            </label>
            <input
              type={field.includes('Date') ? 'date' : 'number'}
              value={question.validation?.[field] || ''}
              onChange={(e) => {
                const value = field.includes('Date') ? e.target.value : parseFloat(e.target.value) || undefined;
                onUpdate(question.id, {
                  validation: {
                    ...question.validation,
                    [field]: value,
                  },
                });
              }}
              className='w-full p-2 border rounded text-sm'
            />
          </div>
        ))}
      </div>
    );
  }, [question.type, question.validation, question.id, onUpdate]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(question.id, { title: e.target.value });
    },
    [question.id, onUpdate],
  );

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdate(question.id, {
        type: e.target.value as QuestionTypes,
        validation: {}, // Reset validation when type changes
      });
    },
    [question.id, onUpdate],
  );

  const handleRequiredChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(question.id, { required: e.target.checked });
    },
    [question.id, onUpdate],
  );

  const handleDelete = useCallback(() => {
    onDelete(question.id);
  }, [question.id, onUpdate]);

  const handleHelperTextUpdate = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(question.id, { helperText: e.target.value });
    },
    [question.id, onUpdate],
  );

  return (
    <div className='border rounded-lg p-4 bg-white shadow-sm'>
      {error && <div className='question-error no-margin error-message'>X {error}</div>}
      <div className='flex justify-between gap-4 mb-4'>
        <input
          type='text'
          value={question.title}
          onChange={handleTitleChange}
          placeholder='Question text'
          className={`flex-1 p-2 border rounded`}
        />
        <select value={question.type} onChange={handleTypeChange} className='p-2 border rounded'>
          {questionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <label className='flex items-center gap-2'>
          <input type='checkbox' checked={question.required} onChange={handleRequiredChange} />
          Required
        </label>
        <button onClick={handleDelete} className='text-red-500 hover:text-red-700'>
          Delete
        </button>
      </div>

      <div className='mt-2'>
        <label className='left-align block text-sm text-gray-600 mb-1'>Helper Text (Optional)</label>
        <input
          type='text'
          value={question.helperText || ''}
          onChange={handleHelperTextUpdate}
          placeholder='Add helper text for this question'
          className='w-full p-2 border rounded text-sm'
        />
      </div>

      {renderValidationFields}

      {(question.type === 'multiple-choice' || question.type === 'single-select') && (
        <div className='mt-4 space-y-2'>
          {question.options?.map((option) => (
            <div key={option.id} className='flex gap-2'>
              <input
                type='text'
                value={option.value}
                onChange={(e) => onUpdateOption(question.id, option.id, e.target.value)}
                placeholder='Option text'
                className='flex-1 p-2 border rounded'
              />
              <button
                onClick={() => onDeleteOption(question.id, option.id)}
                className='text-red-500 hover:text-red-700'
              >
                Remove
              </button>
            </div>
          ))}
          <button onClick={() => onAddOption(question.id)} className='text-blue-500 hover:text-blue-700'>
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
};
