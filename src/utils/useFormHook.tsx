import { useState, useEffect, useCallback } from 'react';
import { FormConfig, Question as QuestionType } from '../types/form';
import { validateField } from '../utils/validations';

const useFormConfig = () => {
  const loadFromLocalStorage = () => {
    const savedFormConfig = localStorage.getItem('formConfig');
    return savedFormConfig
      ? JSON.parse(savedFormConfig)
      : {
          id: 'default-form',
          title: 'My Form',
          questions: [
            {
              id: `q-${Date.now()}`,
              title: '',
              type: 'short-text',
              questionInput: { value: '', error: '' },
              answerInput: { value: '', error: '' },
            },
          ],
        };
  };

  const [formConfig, setFormConfig] = useState<FormConfig>(loadFromLocalStorage());
  const [isSaving, setIsSaving] = useState(false);
  const [dots, setDots] = useState('.');

  // Auto-save logic
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      setIsSaving(true);
      localStorage.setItem('formConfig', JSON.stringify(formConfig));
      setTimeout(() => setIsSaving(false), 2000);
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [formConfig]);

  // Dots for saving animation
  useEffect(() => {
    if (isSaving) {
      const dotInterval = setInterval(() => {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : '.'));
      }, 300);
      return () => clearInterval(dotInterval);
    }
  }, [isSaving]);

  const addQuestion = useCallback(() => {
    const newQuestion: QuestionType = {
      id: `q-${Date.now()}`,
      title: '',
      type: 'short-text',
      questionInput: { value: '', error: '' },
      answerInput: { value: '', error: '' },
    };
    setFormConfig((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  }, []);

  const updateQuestion = useCallback((id: string, updates: Partial<QuestionType>) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  }, []);

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
      alert('Form saved successfully!');
    }

    localStorage.setItem('formConfig', JSON.stringify(updatedFormConfig));
    setFormConfig(updatedFormConfig);
  };

  return {
    formConfig,
    isSaving,
    dots,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    handleFormSubmit,
  };
};

export default useFormConfig;
