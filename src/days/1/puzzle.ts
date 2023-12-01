import { numberSum } from '../../helpers/number-sum';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly stringDigits = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];

  public solveFirst(): PuzzleResult {
    return numberSum(
      splitIntoLines(this.input).map((line) => this.getCalibrationValue(line))
    );
  }

  public solveSecond(): PuzzleResult {
    return numberSum(
      splitIntoLines(this.input).map((line) =>
        this.getCalibrationValue(this.convertStringDigitsToNumbers(line))
      )
    );
  }

  private convertStringDigitsToNumbers(line: string) {
    this.stringDigits.forEach(
      (digit, index) =>
        (line = line.split(digit).join(`${digit}${index + 1}${digit}`))
    );
    return line;
  }

  private getCalibrationValue(line: string) {
    let first: number;
    let last: number;
    let firstIndex: number;

    for (let i = 0; i < line.length; i++) {
      if (this.isDigit(line[i])) {
        first = parseInt(line[i], 10);
        firstIndex = i;
        break;
      }
    }

    if (!first) {
      return 0;
    }

    for (let i = line.length - 1; i >= firstIndex; i--) {
      if (this.isDigit(line[i])) {
        last = parseInt(line[i], 10);
        break;
      }
    }

    return first * 10 + last;
  }

  private isDigit = (char: string) => char >= '0' && char <= '9';
}
