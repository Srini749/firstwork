import { Question } from "../types/form";

export const validators = {
  'short-text': (value: string, question: Question) => {
    if (question.required && !value) return 'This field is required';
    if (question.validation?.minLength && value.length < question.validation.minLength) {
      return `Minimum ${question.validation.minLength} characters required`;
    }
    if (question.validation?.maxLength && value.length > question.validation.maxLength) {
      return `Maximum ${question.validation.maxLength} characters allowed`;
    }
    return null;
  },

  'email': (value: string, question: Question) => {
    if (question.required && !value) return 'This field is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  },

  'phone': (value: string, question: Question) => {
    if (question.required && !value) return 'This field is required';
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (value && !phoneRegex.test(value)) return 'Please enter a valid phone number';
    return null;
  },

  'number': (value: string, question: Question) => {
    if (question.required && !value) return 'This field is required';
    const num = Number(value);
    if (isNaN(num)) return 'Please enter a valid number';
    if (question.validation?.min !== undefined && num < question.validation.min) {
      return `Minimum value is ${question.validation.min}`;
    }
    if (question.validation?.max !== undefined && num > question.validation.max) {
      return `Maximum value is ${question.validation.max}`;
    }
    return null;
  },

  'multiple-choice': (value: string[], question: Question) => {
    if (question.required && (!value || value.length === 0)) {
      return 'Please select at least one option';
    }
    return null;
  },

  'single-select': (value: string, question: Question) => {
    if (question.required && !value) return 'Please select an option';
    return null;
  },

  'date': (value: string, question: Question) => {
    if (question.required && !value) return 'This field is required';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Please enter a valid date';
    return null;
  }
};