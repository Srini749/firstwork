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
  helperText?: string;
  validation?: {
    minLength?: number;
    [key: string]: number | string | undefined;
    maxLength?: number;
    min?: number;
    max?: number;
    minDate?: string | undefined,
    maxDate?: string | undefined,
  };
  answer?: string| string[] | undefined,
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  isSubmitted?: boolean,
}
export interface FormAnswers {
  [key: string]: string | string[];
}