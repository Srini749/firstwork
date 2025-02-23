import { Question, QuestionType } from "../types/form";

type ValidatorFunction = (value: any, question: Question) => string | null;

const requiredValidator = (value: any, message: string) => (!value ? message : null);

const lengthValidator = (value: string, question: Question) => {
  if (question.validation?.minLength && value.length < question.validation.minLength) {
    return `Minimum ${question.validation.minLength} characters required`;
  }
  if (question.validation?.maxLength && value.length > question.validation.maxLength) {
    return `Maximum ${question.validation.maxLength} characters allowed`;
  }
  return null;
};

const regexValidator = (value: string, regex: RegExp, message: string) =>
  value && !regex.test(value) ? message : null;

const rangeValidator = (value: number, question: Question) => {
  if (isNaN(value)) return 'Please enter a valid number';
  if (question.validation?.min !== undefined && value < question.validation.min) {
    return `Minimum value is ${question.validation.min}`;
  }
  if (question.validation?.max !== undefined && value > question.validation.max) {
    return `Maximum value is ${question.validation.max}`;
  }
  return null;
};

export const validators: Record<QuestionType, ValidatorFunction> = {
  'short-text': (value, question) =>
    requiredValidator(value, 'This field is required') || lengthValidator(value, question),

  'long-text': (value, question) =>
    requiredValidator(value, 'This field is required') || lengthValidator(value, question),

  email: (value, question) =>
    requiredValidator(value, 'This field is required') ||
    regexValidator(value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),

  phone: (value, question) =>
    requiredValidator(value, 'This field is required') ||
    regexValidator(value, /^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'),

  number: (value, question) =>
    requiredValidator(value, 'This field is required') || rangeValidator(Number(value), question),

  'multiple-choice': (value, question) =>
    requiredValidator(value?.length ? value : null, 'Please select at least one option'),

  'single-select': (value, question) =>
    requiredValidator(value, 'Please select an option'),

  date: (value, question) => {
    if (requiredValidator(value, 'This field is required')) return 'This field is required';
    const date = new Date(value);
    return isNaN(date.getTime()) ? 'Please enter a valid date' : null;
  }
};
