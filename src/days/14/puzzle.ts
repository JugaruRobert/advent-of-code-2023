import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly mirrorSymbol = 'O';
  private readonly cyclesToCompute = 1000000000;

  public solveFirst(): PuzzleResult {
    const system = splitIntoLines(this.input).map((line) => line.split(''));
    this.tiltNorth(system);
    return this.computeLoad(system);
  }

  public solveSecond(): PuzzleResult {
    const system = splitIntoLines(this.input).map((line) => line.split(''));

    const { allRepeatingCycles, firstRepeatingCycle } =
      this.getNrUniqueCycles(system);

    const nrTilts =
      firstRepeatingCycle +
      ((this.cyclesToCompute - firstRepeatingCycle) % allRepeatingCycles);

    for (let i = 0; i < nrTilts; i++) {
      this.tilt(system);
    }

    return this.computeLoad(system);
  }

  private getNrUniqueCycles(system: string[][]) {
    const systemClone = structuredClone(system);
    const uniqueCycles: Record<string, number> = {};
    for (let i = 0; i < this.cyclesToCompute; i++) {
      this.tilt(systemClone);

      const key = systemClone.map((row) => row.join('')).join('');
      if (uniqueCycles[key]) {
        return {
          allRepeatingCycles:
            Object.keys(uniqueCycles).length - uniqueCycles[key],
          firstRepeatingCycle: uniqueCycles[key],
        };
      }

      uniqueCycles[key] = i;
    }
  }

  private tilt(system: string[][]) {
    this.tiltNorth(system);
    this.tiltWest(system);
    this.tiltSouth(system);
    this.tiltEast(system);
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

  private tiltWest(system: string[][]) {
    for (let i = 0; i < system.length; i++) {
      for (let j = 1; j < system[i].length; j++) {
        if (system[i][j] !== this.mirrorSymbol) {
          continue;
        }

        let column = j;
        while (column > 0 && system[i][column - 1] === '.') {
          system[i][column - 1] = this.mirrorSymbol;
          system[i][column] = '.';
          column--;
        }
      }
    }
  }

  private tiltSouth(system: string[][]) {
    for (let i = system.length - 2; i >= 0; i--) {
      for (let j = 0; j < system[i].length; j++) {
        if (system[i][j] !== this.mirrorSymbol) {
          continue;
        }

        let row = i;
        while (row < system.length - 1 && system[row + 1][j] === '.') {
          system[row + 1][j] = this.mirrorSymbol;
          system[row][j] = '.';
          row++;
        }
      }
    }
  }

  private tiltEast(system: string[][]) {
    for (let i = 0; i < system.length; i++) {
      for (let j = system[i].length - 2; j >= 0; j--) {
        if (system[i][j] !== this.mirrorSymbol) {
          continue;
        }

        let column = j;
        while (column < system[i].length - 1 && system[i][column + 1] === '.') {
          system[i][column + 1] = this.mirrorSymbol;
          system[i][column] = '.';
          column++;
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
