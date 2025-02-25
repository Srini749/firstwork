import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Question } from './Question';

interface DraggableQuestionProps {
  question: any; // Replace 'any' with your question type
  index: number;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onAddOption: (questionId: string) => void;
  onUpdateOption: (questionId: string, optionId: string, value: string) => void;
  onDeleteOption: (questionId: string, optionId: string) => void;
  error?: string | null | undefined;
}

export const DraggableQuestion: React.FC<DraggableQuestionProps> = ({
  question,
  index,
  onUpdate,
  onDelete,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  error,
}) => (
  <Draggable draggableId={question.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
      >
        <div className="flex items-start gap-2 bg-white rounded-lg shadow p-4">
          <div
            {...provided.dragHandleProps}
            className="cursor-move pt-2 text-gray-400 hover:text-gray-600"
          >
            ⋮⋮
          </div>
          <div className="flex-1">
            <Question
              question={question}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddOption={onAddOption}
              onUpdateOption={onUpdateOption}
              onDeleteOption={onDeleteOption}
              error={error}
            />
          </div>
        </div>
      </div>
    )}
  </Draggable>
);