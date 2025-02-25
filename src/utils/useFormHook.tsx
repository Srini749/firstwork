import { useState, useCallback, useEffect } from 'react';
import { FormConfig, Question } from '../types/form';
import { useNavigate } from 'react-router-dom';
import { validatorsForFormCreation } from './validations';

export const useFormBuilder = (formId?: string) => {
  const [errors, setErrors] = useState<{ [key: string]: string | null | undefined }>({});
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
    let urlWithoutEdit = currentUrl.replace('/edit', '');
    if (!currentUrl.includes(formConfig.id)) {
      urlWithoutEdit = urlWithoutEdit.replace('/new', `/${formConfig.id}`)
    }
    window.open(urlWithoutEdit, '_blank');
  };

  const saveForm = useCallback(() => {
    const updatedConfig = {
      ...formConfig,
      updatedAt: new Date().toISOString(),
    };
    const updatedErrors = formConfig.questions.reduce((acc, question) => {
      const validate = validatorsForFormCreation[question.type];
      if (validate) {
        const error = validate(question);
        acc[question.id] = error || null;
      }
      return acc;
    }, {} as { [key: string]: string | null | undefined });
    setSaving(false);
    const hasError = Object.values(updatedErrors).some(value => value !== null && value !== undefined);
    if (hasError) {
      setErrors(updatedErrors);
      return;
    }
    setErrors({});
    setLastSaved(new Date());
    localStorage.setItem(formConfig.id, JSON.stringify(updatedConfig));
  }, [formConfig]);

  const reorderQuestions = (sourceIndex: number, destinationIndex: number) => {
    setFormConfig((prev) => {
      const newQuestions = Array.from(prev.questions);
      const [removed] = newQuestions.splice(sourceIndex, 1);
      newQuestions.splice(destinationIndex, 0, removed);
  
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  };

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
    errors,
    reorderQuestions,
  };
};
