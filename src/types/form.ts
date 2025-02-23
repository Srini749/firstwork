export type QuestionType =
  | 'short-text'
  | 'long-text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date';

export interface Question {
  id: string;
  title: string;
  type: QuestionType | string;
  placeholder?: string;
  options?: string[]; // For select questions
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  questionInput: {
    value: string,
    error: string,
  },
  answerInput: {
    value: string,
    error: string,
  },
  
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}
