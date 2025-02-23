import { useState, useCallback, useEffect } from 'react';
import { FormConfig, Question, QuestionType } from '../types/form';
import { useNavigate } from 'react-router-dom';

export const useFormBuilder = (formId?: string) => {
  const navigate = useNavigate();
  const [formConfig, setFormConfig] = useState<FormConfig>(() => {
    const saved = localStorage.getItem(`${formId || 'draft'}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      id: formId || `form-${Date.now()}`,
      title: 'Untitled Form',
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Auto-save effect
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setSaving(true);
    }, 7000);
    const formDataTimer = setTimeout(() => {
      saveForm();
    }, 10000);
    return () => {
      clearTimeout(formDataTimer);
      clearTimeout(animationTimer);
    };
  }, [formConfig]);

  const addQuestion = useCallback(() => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      title: '',
      type: 'short-text',
      required: false,
    };
    setFormConfig((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  }, []);

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }));
  }, []);

  const updateFormTitle = useCallback((title: string) => {
    setFormConfig((prev) => ({
      ...prev,
      title,
    }));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  }, []);

  const addOption = useCallback((questionId: string) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const options = q.options || [];
          return {
            ...q,
            options: [...options, { id: `opt-${Date.now()}`, value: '' }],
          };
        }
        return q;
      }),
    }));
  }, []);

  const updateOption = useCallback((questionId: string, optionId: string, value: string) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId && q.options) {
          return {
            ...q,
            options: q.options.map((opt) => (opt.id === optionId ? { ...opt, value } : opt)),
          };
        }
        return q;
      }),
    }));
  }, []);

  const deleteOption = useCallback((questionId: string, optionId: string) => {
    setFormConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId && q.options) {
          return {
            ...q,
            options: q.options.filter((opt) => opt.id !== optionId),
          };
        }
        return q;
      }),
    }));
  }, []);

  const previewForm = () => {
    const currentUrl = window.location.href;
    const urlWithoutEdit = currentUrl.replace('/edit', '');
    window.open(urlWithoutEdit, '_blank');
  };

  const saveForm = useCallback(() => {
    const updatedConfig = {
      ...formConfig,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(formConfig.id, JSON.stringify(updatedConfig));
    setLastSaved(new Date());
    setSaving(false);
  }, [formConfig]);

  return {
    formConfig,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption,
    saveForm,
    lastSaved,
    previewForm,
    updateFormTitle,
    saving,
  };
};
