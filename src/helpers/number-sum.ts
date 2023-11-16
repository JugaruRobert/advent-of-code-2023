export function numberSum(input: number[]): number {
  return input.reduce((sum, current) => {
    return sum + current;
  }, 0);
}
