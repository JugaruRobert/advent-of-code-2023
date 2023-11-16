export function splitIntoLines(input: string, trim: boolean = false) {
  var lines = input.split('\r\n');

  if (trim) {
    lines = lines.map((line) => line.trim());
  }

  if (lines[lines.length - 1].trim().length == 0) {
    lines = lines.slice(0, lines.length - 1);
  }

  return lines;
}
