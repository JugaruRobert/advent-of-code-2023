import PuzzleFactory from './utils/puzzle-factory';

const args = process.argv.slice(2);
const dayToSolve = args[0];

if (!dayToSolve) {
  console.error('No day specified');
  process.exit(1);
}

console.log(`Solving Day #${args[0]}`);

(async () => {
  const puzzle = await PuzzleFactory.getPuzzle(args[0]);
  console.log('Part 1: ', puzzle.solveFirst());
  console.log('Part 2: ', puzzle.solveSecond());
})();
