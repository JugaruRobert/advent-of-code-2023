export function splitIntoLines(input: string, trim = false) {
  const splitCharacter = input.includes('\r') ? '\r\n' : '\n';
  let lines = input.split(splitCharacter);

  if (trim) {
    lines = lines.map((line) => line.trim());
  }

  if (lines[lines.length - 1].trim().length == 0) {
    lines = lines.slice(0, lines.length - 1);
  }

  return lines;
}
