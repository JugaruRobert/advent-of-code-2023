import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly maxColors: Record<string, number> = {
    red: 12,
    green: 13,
    blue: 14,
  };

  public solveFirst(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    let sum = 0;

    lines.forEach((line) => {
      const sets = line.split(': ')[1].split('; ');
      const allSetsValid = sets.every((set) => this.setIsPossible(set));

      if (allSetsValid) {
        const gameId = line.split('Game ')[1].split(':')[0];
        sum += parseInt(gameId, 10);
      }
    });

    return sum;
  }

  private setIsPossible(set: string) {
    const colorCubes = set.split(', ');

    return colorCubes.every((colorCube) => {
      const parts = colorCube.split(' ');
      const count = parseInt(parts[0]);
      const color = parts[1];
      return count <= this.maxColors[color];
    });
  }

  public solveSecond(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    let result = 0;

    lines.forEach((line) => {
      const sets = line.split(': ')[1].split('; ');
      result += this.getSetPower(sets);
    });

    return result;
  }

  private getSetPower(sets: string[]) {
    const maximumOfColor: Record<string, number> = {
      red: 0,
      green: 0,
      blue: 0,
    };

    sets.forEach((set) => {
      const colorCubes = set.split(', ');

      colorCubes.forEach((colorCube) => {
        const parts = colorCube.split(' ');
        const count = parseInt(parts[0]);
        const color = parts[1];

        if (count > maximumOfColor[color]) {
          maximumOfColor[color] = count;
        }
      });
    });

    return (
      maximumOfColor['red'] * maximumOfColor['green'] * maximumOfColor['blue']
    );
  }
}
