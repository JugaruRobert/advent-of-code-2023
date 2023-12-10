import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private handValues: Record<string, number> = {};
  private withJoker = false;
  private cardValue: Record<string, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
  };

  public solveFirst(): PuzzleResult {
    this.setCardValues();
    const hands = Object.keys(this.handValues);
    const handStrengths = this.computeHandStrengths(hands);
    return this.calculateResult(handStrengths);
  }

  public solveSecond(): PuzzleResult {
    this.withJoker = true;
    this.setCardValues();
    const hands = Object.keys(this.handValues);
    const handStrengths = this.computeHandStrengths(hands);
    return this.calculateResult(handStrengths);
  }

  private calculateResult(handStrengths: Record<string, HandStrength>) {
    const sortedCards = Object.keys(handStrengths).sort((a, b) =>
      this.compareCardStrengths(handStrengths[a], handStrengths[b])
    );
    sortedCards.forEach((card) => console.log(card));

    let result = 0;
    for (let i = 0; i < sortedCards.length; i++) {
      result += this.handValues[sortedCards[i]] * (i + 1);
    }
    return result;
  }

  private compareCardStrengths(a: HandStrength, b: HandStrength) {
    if (a.handType !== b.handType) {
      return b.handType - a.handType;
    }

    for (let i = 0; i < 5; i++) {
      if (a.cards[i] !== b.cards[i]) {
        return this.getCardValue(a.cards[i]) - this.getCardValue(b.cards[i]);
      }
    }

    return 0;
  }

  private computeHandStrengths(hands: string[]) {
    const strengths: Record<string, HandStrength> = {};
    hands.forEach((hand) => {
      const handType = this.withJoker
        ? this.getJokerCardHandType(hand)
        : this.getCardHandType(hand);
      strengths[hand] = { handType, cards: hand.split('') };
    });
    return strengths;
  }

  private setCardValues() {
    const lines = splitIntoLines(this.input);
    this.handValues = lines.reduce((result, curr) => {
      const parts = curr.split(' ');
      result[parts[0]] = parseInt(parts[1]);
      return result;
    }, {} as Record<string, number>);
  }

  private getCardHandType(hand: string) {
    const freq: Record<string, number> = {};
    let max = 0;
    for (const char of hand) {
      freq[char] = (freq[char] || 0) + 1;
      if (freq[char] > max) {
        max = freq[char];
      }
    }

    return this.getHandPriorityFromMaxCount(max, freq);
  }

  private getJokerCardHandType(hand: string) {
    const freq: Record<string, number> = {};
    let max = 0;
    for (const char of hand) {
      freq[char] = (freq[char] || 0) + 1;
      if (freq[char] > max && char !== 'J') {
        max = freq[char];
      }
    }

    const nrJokers = freq['J'] || 0;
    if (nrJokers > 0) {
      if (max === 2) {
        const nrPairs = Object.keys(freq).filter(
          (key) => freq[key] === 2
        ).length;
        if (nrPairs === 2 && nrJokers === 1) {
          return HandType.FullHouse;
        }
      }

      max += nrJokers;
      delete freq['J'];
    }

    return this.getHandPriorityFromMaxCount(max, freq);
  }

  private getHandPriorityFromMaxCount(
    maxCount: number,
    freq: Record<string, number>
  ) {
    if (maxCount === 5) {
      return HandType.FiveOfAKind;
    }

    if (maxCount === 4) {
      return HandType.FourOfAKind;
    }

    if (maxCount === 3) {
      return Object.keys(freq).length === 2
        ? HandType.FullHouse
        : HandType.ThreeOfAKind;
    }

    if (maxCount === 2) {
      const nrPairs = Object.keys(freq).filter((key) => freq[key] === 2).length;
      return nrPairs === 2 ? HandType.TwoPair : HandType.OnePair;
    }

    return HandType.HighCard;
  }

  private getCardValue(card: string) {
    if (this.withJoker && card === 'J') {
      return 1;
    }
    return this.cardValue[card] || parseInt(card, 10);
  }
}

interface HandStrength {
  handType: HandType;
  cards: string[];
}

const enum HandType {
  FiveOfAKind,
  FourOfAKind,
  FullHouse,
  ThreeOfAKind,
  TwoPair,
  OnePair,
  HighCard,
}
