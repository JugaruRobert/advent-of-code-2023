import { numberSum } from '../../helpers/number-sum';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): PuzzleResult {
    const steps = this.input.replace(/\n/, '').replace(/\r/, '').split(',');
    return numberSum(steps.map((step) => this.getHash(step)));
  }

  public solveSecond(): PuzzleResult {
    const boxes: Record<number, Lens[]> = {};
    const steps = this.input.replace(/\n/, '').replace(/\r/, '').split(',');

    for (const step of steps) {
      if (step[step.length - 1] === '-') {
        this.removeLens(boxes, step.slice(0, step.length - 1));
      } else {
        const parts = step.split('=');
        const lens: Lens = {
          label: parts[0],
          focalLength: parseInt(parts[1], 10),
        };
        this.addLens(boxes, lens);
      }
    }

    return this.computeResult(boxes);
  }

  private computeResult(boxes: Record<number, Lens[]>) {
    let result = 0;

    Object.keys(boxes).forEach((boxIndex) => {
      const index = parseInt(boxIndex, 10);
      const box = boxes[index];
      for (let i = 0; i < box.length; i++) {
        result += (index + 1) * (i + 1) * box[i].focalLength;
      }
    });
    return result;
  }

  private removeLens(boxes: Record<number, Lens[]>, label: string) {
    const hash = this.getHash(label);
    const position = boxes[hash]?.findIndex((lens) => lens.label === label);
    if (position > -1) {
      boxes[hash].splice(position, 1);

      if (boxes[hash].length == 0) {
        delete boxes[hash];
      }
    }
  }

  private addLens(boxes: Record<number, Lens[]>, lens: Lens) {
    const hash = this.getHash(lens.label);
    const existingPosition = boxes[hash]?.findIndex(
      (boxLens) => boxLens.label === lens.label
    );

    if (existingPosition > -1) {
      boxes[hash][existingPosition] = lens;
      return;
    }

    if (hash in boxes) {
      boxes[hash].push(lens);
    } else {
      boxes[hash] = [lens];
    }
  }

  private getHash(text: string) {
    let result = 0;
    for (let i = 0; i < text.length; i++) {
      result = ((result + text.charCodeAt(i)) * 17) % 256;
    }
    return result;
  }
}

interface Lens {
  label: string;
  focalLength: number;
}
