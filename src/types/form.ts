export type QuestionType = 'short-text' | 'long-text' | 'number' | 'email' | 'phone' | 'date' | 'multiple-choice' | 'single-select';

export interface Option {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options?: Option[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}