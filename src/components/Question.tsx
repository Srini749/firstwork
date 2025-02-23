import React from 'react';
import { Question as QuestionType, QuestionType as QuestionTypes } from '../types/form';

interface QuestionProps {
  question: QuestionType;
  onUpdate: (id: string, updates: Partial<QuestionType>) => void;
  onDelete: (id: string) => void;
  onAddOption: (questionId: string) => void;
  onUpdateOption: (questionId: string, optionId: string, value: string) => void;
  onDeleteOption: (questionId: string, optionId: string) => void;
}

export const Question: React.FC<QuestionProps> = ({
  question,
  onUpdate,
  onDelete,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
}) => {
  const questionTypes: { value: QuestionTypes; label: string }[] = [
    { value: 'short-text', label: 'Short Text' },
    { value: 'long-text', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'date', label: 'Date' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'single-select', label: 'Single Select' },
  ];

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between gap-4 mb-4">
        <input
          type="text"
          value={question.title}
          onChange={(e) => onUpdate(question.id, { title: e.target.value })}
          placeholder="Question text"
          className="flex-1 p-2 border rounded"
        />
        <select
          value={question.type}
          onChange={(e) => onUpdate(question.id, { type: e.target.value as QuestionTypes })}
          className="p-2 border rounded"
        >
          {questionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate(question.id, { required: e.target.checked })}
          />
          Required
        </label>
        <button
          onClick={() => onDelete(question.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      {(question.type === 'multiple-choice' || question.type === 'single-select') && (
        <div className="ml-4 space-y-2">
          {question.options?.map((option) => (
            <div key={option.id} className="flex gap-2">
              <input
                type="text"
                value={option.value}
                onChange={(e) => onUpdateOption(question.id, option.id, e.target.value)}
                placeholder="Option text"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => onDeleteOption(question.id, option.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => onAddOption(question.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
};