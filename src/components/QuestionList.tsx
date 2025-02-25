import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { DraggableQuestion } from './DraggableQuestion';

interface QuestionListProps {
  questions: any[]; // Replace 'any' with your question type
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onAddOption: (questionId: string) => void;
  onUpdateOption: (questionId: string, optionId: string, value: string) => void;
  onDeleteOption: (questionId: string, optionId: string) => void;
  errors: { [key: string]: string | null | undefined };
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onUpdate,
  onDelete,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  errors,
}) => {
  return <Droppable droppableId="question-list">
    {(provided) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className="space-y-4 question-list"
      >
        {questions.map((question, index) => (
          <DraggableQuestion
            key={question.id}
            question={question}
            index={index}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddOption={onAddOption}
            onUpdateOption={onUpdateOption}
            onDeleteOption={onDeleteOption}
            error={errors[question.id]}
          />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
};
