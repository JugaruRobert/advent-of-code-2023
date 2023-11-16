import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): PuzzleResult {
    return 'unsolved';
  }

  public solveSecond(): PuzzleResult {
    return 'unsolved';
  }
}
