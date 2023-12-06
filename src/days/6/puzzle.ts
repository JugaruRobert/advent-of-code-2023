import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): PuzzleResult {
    const data = this.getTimesAndDistances();
    let result = 1;
    data.forEach((pair) => (result *= this.getPossibleOptions(pair)));
    return result;
  }

  public solveSecond(): PuzzleResult {
    const input = splitIntoLines(this.input);
    const time = parseInt(input[0].split('Time: ')[1].replace(/ /g, ''), 10);
    const distance = parseInt(
      input[1].split('Distance: ')[1].replace(/ /g, ''),
      10
    );
    return this.getPossibleOptions({ time, distance });
  }

  private getPossibleOptions(pair: TimeDistance) {
    let options = 0;
    for (let i = 1; i < pair.time / 2; i++) {
      if (i * (pair.time - i) > pair.distance) {
        options += 2;
      }
    }

    if (pair.time % 2 === 0 && pair.time * pair.time > pair.distance) {
      options++;
    }
    return options;
  }

  private getTimesAndDistances() {
    const input = splitIntoLines(this.input);
    const times = input[0]
      .split('Time: ')[1]
      .split(' ')
      .filter(Boolean)
      .map((str) => parseInt(str, 10));

    const distances = input[1]
      .split('Distance: ')[1]
      .split(' ')
      .filter(Boolean)
      .map((str) => parseInt(str, 10));

    const timeDistances: TimeDistance[] = [];
    for (let i = 0; i < times.length; i++) {
      timeDistances.push({
        time: times[i],
        distance: distances[i],
      });
    }

    return timeDistances;
  }
}

interface TimeDistance {
  time: number;
  distance: number;
}
