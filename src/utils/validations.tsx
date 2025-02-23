import { Question, QuestionType } from '../types/form';

type ValidatorFunctionForSubmission = (value: any, question: Question) => string | null;
type ValidatorFunctionForCreation = (question: Question) => string | null;

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

export const validatorsForFormSubmission: Record<QuestionType, ValidatorFunctionForSubmission> = {
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

  'single-select': (value, question) => requiredValidator(value, 'Please select an option'),

  date: (value, question) => {
    if (requiredValidator(value, 'This field is required')) return 'This field is required';
    const date = new Date(value);
    return isNaN(date.getTime()) ? 'Please enter a valid date' : null;
  },
};

export const validatorsForFormCreation: Record<QuestionType, ValidatorFunctionForCreation> = {
  'short-text': (question) => (question.title === '' ? 'Title field is required' : null),

  'long-text': (question) => (question.title === '' ? 'Title field is required' : null),

  email: (question) => (question.title === '' ? 'Title field is required' : null),

  phone: (question) => (question.title === '' ? 'Title field is required' : null),

  number: (question) => (question.title === '' ? 'Title field is required' : null),

  'multiple-choice': (question) =>
    question.title === ''
      ? 'Title field is required'
      : !question.options || (question.options && question.options.length < 2)
      ? 'Please add atleast 2 options'
      : null,

  'single-select': (question) =>
    question.title === ''
      ? 'This field is required'
      : !question.options || (question.options && question.options.length < 2)
      ? 'Please add atleast 2 options'
      : null,

  date: (question) => (question.title !== '' ? 'Title field is required' : null),
};
