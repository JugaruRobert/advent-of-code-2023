import { numberSum } from '../../helpers/number-sum';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): PuzzleResult {
    const lines = splitIntoLines(this.input).map((line) =>
      line.split(' ').map((str) => parseInt(str))
    );
    return numberSum(lines.map((line) => this.getNextInSequence(line)));
  }

  public solveSecond(): PuzzleResult {
    const lines = splitIntoLines(this.input).map((line) =>
      line.split(' ').map((str) => parseInt(str))
    );
    return numberSum(lines.map((line) => this.getNextInSequence(line, false)));
  }

  private getNextInSequence(sequence: number[], computeLast = true): number {
    if (sequence.every((nr) => nr === 0)) {
      return 0;
    }

    const newSequence: number[] = [];
    for (let i = 1; i < sequence.length; i++) {
      newSequence.push(sequence[i] - sequence[i - 1]);
    }

    if (computeLast) {
      return (
        sequence[sequence.length - 1] +
        this.getNextInSequence(newSequence, computeLast)
      );
    }

    return sequence[0] - this.getNextInSequence(newSequence, computeLast);
  }
}
