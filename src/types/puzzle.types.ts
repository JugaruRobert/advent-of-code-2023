export interface PuzzleInterface {
  solveFirst: () => PuzzleResult;
  solveSecond: () => PuzzleResult;
}

export type PuzzleResult = string | number;
