import { numberSum } from '../../helpers/number-sum';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly gears: Record<string, GearDetail> = {};

  public solveFirst(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    let sum = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let partNumber = false;
      let current = 0;

      for (let j = 0; j < line.length; j++) {
        if (this.isDigit(line[j])) {
          partNumber = partNumber || this.isAdjacentToSymbol(lines, i, j);
          current = current * 10 + parseInt(line[j], 10);
        } else {
          if (partNumber) {
            sum += current;
            partNumber = false;
          }

          current = 0;
        }
      }

      if (partNumber) {
        sum += current;
      }
    }

    return sum;
  }

  public solveSecond(): PuzzleResult {
    const lines = splitIntoLines(this.input);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let partNumber = false;
      let current = 0;
      let gears = new Set<string>();

      for (let j = 0; j < line.length; j++) {
        if (this.isDigit(line[j])) {
          const result = this.isAdjacentToSymbolWithGears(lines, i, j);
          partNumber = partNumber || result.valid;
          result.gears.forEach((gear) => gears.add(gear));
          current = current * 10 + parseInt(line[j], 10);
        } else {
          if (partNumber) {
            partNumber = false;
            this.updateGearDetails(gears, current);
          }

          gears = new Set();
          current = 0;
        }
      }

      if (partNumber) {
        this.updateGearDetails(gears, current);
      }
    }

    return numberSum(
      Object.keys(this.gears).map((key) =>
        this.gears[key].adjNumbers === 2 ? this.gears[key].product : 0
      )
    );
  }

  private isAdjacentToSymbol(lines: string[], i: number, j: number) {
    const directions = [
      { x: i + 1, y: j },
      { x: i + 1, y: j + 1 },
      { x: i + 1, y: j - 1 },
      { x: i - 1, y: j },
      { x: i - 1, y: j + 1 },
      { x: i - 1, y: j - 1 },
      { x: i, y: j + 1 },
      { x: i, y: j - 1 },
    ];
    for (let i = 0; i < directions.length; i++) {
      const { x, y } = directions[i];
      if (lines[x] && lines[x][y] && this.isSymbol(lines[x][y])) {
        return true;
      }
    }

    return false;
  }

  private isAdjacentToSymbolWithGears(
    lines: string[],
    i: number,
    j: number
  ): CheckResult {
    const gears = new Set<string>();
    const directions = [
      { x: i + 1, y: j },
      { x: i + 1, y: j + 1 },
      { x: i + 1, y: j - 1 },
      { x: i - 1, y: j },
      { x: i - 1, y: j + 1 },
      { x: i - 1, y: j - 1 },
      { x: i, y: j + 1 },
      { x: i, y: j - 1 },
    ];
    let valid: boolean;

    for (let i = 0; i < directions.length; i++) {
      const { x, y } = directions[i];
      if (lines[x] && lines[x][y] && this.isSymbol(lines[x][y])) {
        valid = true;

        if (lines[x][y] === '*') {
          gears.add(x + '' + y);
        }
      }
    }

    return { valid, gears };
  }

  private updateGearDetails(gears: Set<string>, current: number) {
    gears.forEach((gear) => {
      this.gears[gear] = this.gears[gear]
        ? {
            adjNumbers: this.gears[gear].adjNumbers + 1,
            product: this.gears[gear].product * current,
          }
        : {
            adjNumbers: 1,
            product: current,
          };
    });
  }

  private isSymbol = (char: string) => char !== '.' && !this.isDigit(char);
  private isDigit = (char: string) => char >= '0' && char <= '9';
}

type GearDetail = { adjNumbers: number; product: number };

interface CheckResult {
  valid: boolean;
  gears: Set<string>;
}
