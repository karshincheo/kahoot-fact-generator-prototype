export type GameStateRow = {
  id: number;
  is_locked: boolean;
};

export type PlayerRow = {
  id: string;
  name: string;
  true_fact_1: string;
  true_fact_2: string;
  false_fact_1: string;
  created_at: string;
};

export type KahootQuestionRow = {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  timeLimit: number;
  correctAnswer: 1 | 2 | 3 | 4;
};
