import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly cardResults: Record<number, number> = {};

  public solveFirst(): PuzzleResult {
    const cards = splitIntoLines(this.input).map((line) =>
      this.getCardData(line)
    );
    let result = 0;

    cards.forEach((card) => {
      let points = 1;

      card.numbers.forEach((number) => {
        if (card.winning.has(number)) {
          points *= 2;
        }
      });

      if (points !== 1) {
        result += points / 2;
      }
    });

    return result;
  }

  public solveSecond(): PuzzleResult {
    const allCards = splitIntoLines(this.input).map((line) =>
      this.getCardData(line)
    );

    let result = 0;
    allCards.forEach((card) => {
      result += 1 + this.getAllPossibleCards(allCards, card);
    });
    return result;
  }

  private getAllPossibleCards(allCards: Card[], card: Card) {
    if (this.cardResults[card.id]) {
      return this.cardResults[card.id];
    }

    const winning = card.numbers.filter((number) =>
      card.winning.has(number)
    ).length;

    let result = 0;
    for (let i = 0; i < winning; i++) {
      result += this.getAllPossibleCards(allCards, allCards[card.id + i]) + 1;
    }

    this.cardResults[card.id] = result;
    return result;
  }

  private getCardData(line: string): Card {
    const cardId = parseInt(line.split('Card ')[1].split(':')[0], 10);
    const allNumbers = line.split(': ')[1];

    const getNumbers = (numbers: string) =>
      numbers
        .split(' ')
        .map((number) => parseInt(number.trim(), 10))
        .filter(Boolean);

    const winning = getNumbers(allNumbers.split(' | ')[0]);
    const numbers = getNumbers(allNumbers.split(' | ')[1]);

    return {
      id: cardId,
      winning: new Set(winning),
      numbers,
    };
  }
}

interface Card {
  id: number;
  winning: Set<number>;
  numbers: number[];
}
