import { Question } from '../types/form';

interface ValidationError {
  errorField: 'question' | 'answer'; // You can expand this if needed
  value: string; // The error message
}


export const validateField = (value: any, question: Question): ValidationError | null => {
  if (question.title.trim() === '') {
    return { errorField: 'question', value: 'This field is required' };
  }

  if (!value) {
    return { errorField: 'answer', value: 'This field is required' };
  }

  switch (question.type) {
    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { errorField: 'answer', value: 'Please enter a valid email address' };
      }
      break;

    case 'phone':
      if (value && !/^(\+|00)[1-9][0-9 \-\(\)\.]{7,32}$/.test(value)) {
        return { errorField: 'answer', value: 'Please enter a valid phone number' };
      }
      break;

    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        return { errorField: 'answer', value: 'Please enter a valid number' };
      }
      break;
  }
  return null;
};
