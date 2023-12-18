import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly mirrorSymbol = 'O';

  public solveFirst(): PuzzleResult {
    const system = splitIntoLines(this.input).map((line) => line.split(''));
    this.tiltNorth(system);
    return this.computeLoad(system);
  }

  public solveSecond(): PuzzleResult {
    return 'unsolved';
  }

  private tiltNorth(system: string[][]) {
    for (let i = 1; i < system.length; i++) {
      for (let j = 0; j < system[i].length; j++) {
        if (system[i][j] !== this.mirrorSymbol) {
          continue;
        }

        let row = i;
        while (row > 0 && system[row - 1][j] === '.') {
          system[row - 1][j] = this.mirrorSymbol;
          system[row][j] = '.';
          row--;
        }
      }
    }
  }

  private computeLoad(system: string[][]) {
    let load = 0;

    for (let i = 0; i < system.length; i++) {
      for (let j = 0; j < system[i].length; j++) {
        if (system[i][j] === this.mirrorSymbol) {
          load += system.length - i;
        }
      }
    }

    return load;
  }
}
