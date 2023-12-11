import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private nodes: Record<string, Record<Instruction, string>> = {};

  public solveFirst(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    const instructions = lines[0].trim().split('');
    this.updateNodeMap(lines.slice(2));
    return this.getNumberOfSteps('AAA', instructions, (node) => node === 'ZZZ');
  }

  public solveSecond(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    const instructions = lines[0].trim().split('');
    this.updateNodeMap(lines.slice(2));

    const startingNodes = Object.keys(this.nodes).filter((node) =>
      this.endsWith(node, 'A')
    );

    const values = startingNodes.map((node) =>
      this.getNumberOfSteps(node, instructions, (node) =>
        this.endsWith(node, 'Z')
      )
    );

    return this.getLeastCommonMultiple(values);
  }

  private getLeastCommonMultiple(nums: number[]) {
    let result = nums[0];

    for (let i = 1; i < nums.length; i++) {
      const gcd = this.greatestCommonDivisor(result, nums[i]);
      result = (result * nums[i]) / gcd;
    }

    return result;
  }

  private greatestCommonDivisor(a: number, b: number) {
    for (let temp = b; b !== 0; ) {
      b = a % b;
      a = temp;
      temp = b;
    }
    return a;
  }

  private getNumberOfSteps(
    node: string,
    instructions: string[],
    isValid: (node: string) => boolean
  ) {
    let steps = 0;
    let instructionIndex = 0;

    while (!isValid(node)) {
      const instruction = instructions[instructionIndex] as Instruction;
      node = this.nodes[node][instruction];
      steps++;
      instructionIndex++;
      if (instructionIndex === instructions.length) {
        instructionIndex = 0;
      }
    }

    return steps;
  }

  private updateNodeMap(lines: string[]) {
    for (const line of lines) {
      const parts = line.split(' = ');
      const node = parts[0];

      const left = parts[1].split(', ')[0].slice(1);
      const right = parts[1].split(', ')[1].split(')')[0];

      this.nodes[node] = {
        L: left,
        R: right,
      };
    }
  }

  private endsWith = (node: string, letter: string) =>
    node[node.length - 1] === letter;
}

type Instruction = 'L' | 'R';
