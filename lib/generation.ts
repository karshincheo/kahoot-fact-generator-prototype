import { KahootQuestionRow, PlayerRow } from "@/types/game";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sampleUnique<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

export function generateKahootRows(players: PlayerRow[]): KahootQuestionRow[] {
  if (players.length < 4) {
    throw new Error("Not enough players! Need at least 4.");
  }

  const allNames = players.map((player) => player.name);
  const whoSaidRows: KahootQuestionRow[] = [];
  const trueFalseRows: KahootQuestionRow[] = [];

  for (const player of players) {
    const decoyPool = [...new Set(allNames.filter((name) => name !== player.name))];
    if (decoyPool.length < 3) {
      throw new Error("Need at least 4 players with distinct names.");
    }

    const decoys = sampleUnique(decoyPool, 3);
    const answerChoices = shuffle([player.name, ...decoys]);
    const correctIndex = (answerChoices.indexOf(player.name) + 1) as 1 | 2 | 3 | 4;

    whoSaidRows.push({
      question: `Who said: ${player.true_fact_1}`,
      answer1: answerChoices[0],
      answer2: answerChoices[1],
      answer3: answerChoices[2],
      answer4: answerChoices[3],
      timeLimit: 10,
      correctAnswer: correctIndex,
    });

    const useTrueFact = Math.random() < 0.5;
    const selectedFact = useTrueFact ? player.true_fact_2 : player.false_fact_1;

    trueFalseRows.push({
      question: `True or False: ${player.name} - ${selectedFact}`,
      answer1: "True",
      answer2: "False",
      answer3: "",
      answer4: "",
      timeLimit: 10,
      correctAnswer: useTrueFact ? 1 : 2,
    });
  }

  const shuffledWhoSaid = shuffle(whoSaidRows);
  const shuffledTrueFalse = shuffle(trueFalseRows);
  const startWithTrueFalse = Math.random() < 0.5;
  const alternatingRows: KahootQuestionRow[] = [];

  for (let i = 0; i < players.length; i += 1) {
    if (startWithTrueFalse) {
      alternatingRows.push(shuffledTrueFalse[i], shuffledWhoSaid[i]);
    } else {
      alternatingRows.push(shuffledWhoSaid[i], shuffledTrueFalse[i]);
    }
  }

  return alternatingRows;
}
