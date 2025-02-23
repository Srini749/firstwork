export type QuestionType = 'text' | 'number';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
}

export interface FormConfig {
  id: string;
  title: string;
  questions: Question[];
}