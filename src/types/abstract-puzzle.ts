import { PuzzleResult, PuzzleInterface } from './puzzle.types';

export default abstract class Puzzle implements PuzzleInterface {
  protected input: string;

  public async setInput(input: string) {
    this.input = input;
  }

  public abstract solveFirst(): PuzzleResult;
  public abstract solveSecond(): PuzzleResult;
}
