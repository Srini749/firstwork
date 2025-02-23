// src/components/FormBuilder/index.tsx
import React, { useState } from 'react';
import { FormConfig } from '../types/form';
import './styles.css';

export const FormBuilder: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig>({
    id: 'default-form',
    title: 'My Form',
    questions: [],
  });

  const addQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      title: '',
      type: 'text' as const,
      required: false,
    };

    setFormConfig((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  return (
    <div>
      <h1>{formConfig.title}</h1>
      <button className='add-question-button' onClick={addQuestion}>Add Question</button>
      <div>
        {formConfig.questions.map((q) => (
          <div key={q.id}>{q.title}</div>
        ))}
      </div>
    </div>
  );
};
