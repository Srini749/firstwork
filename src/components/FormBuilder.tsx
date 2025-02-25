import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useFormBuilder } from '../utils/useFormHook';
import { useParams } from 'react-router-dom';
import { FormHeader } from './FormHeader';
import { QuestionList } from './QuestionList';
import './styles/styles.css';

export const FormBuilder: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const {
    formConfig,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption,
    saveForm,
    previewForm,
    lastSaved,
    updateFormTitle,
    saving,
    errors,
    reorderQuestions,
  } = useFormBuilder(formId);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;
    reorderQuestions(sourceIndex, destinationIndex);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <FormHeader
        title={formConfig.title}
        onTitleChange={updateFormTitle}
        onSave={saveForm}
        onPreview={previewForm}
        lastSaved={lastSaved}
        saving={saving}
        canPreview={!!lastSaved && formConfig.questions.length > 0}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <QuestionList
          questions={formConfig.questions}
          onUpdate={updateQuestion}
          onDelete={deleteQuestion}
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onDeleteOption={deleteOption}
          errors={errors}
        />
      </DragDropContext>

      <button
        onClick={addQuestion}
        className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
      >
        + Add Question
      </button>
    </div>
  );
};