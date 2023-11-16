export function numberSort(ascending = true) {
  return (a: number, b: number) => (ascending ? a - b : b - a);
}
