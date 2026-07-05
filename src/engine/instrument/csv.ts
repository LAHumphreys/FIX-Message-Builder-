/**
 * Dependency-free CSV parsing/serialisation (RFC-4180-ish: quoted fields,
 * doubled quotes, embedded commas/newlines). Column order is preserved so
 * a written-back file diffs minimally against its source (§3.9).
 */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  let i = 0;
  const push = () => {
    row.push(cell);
    cell = '';
  };
  const pushRow = () => {
    push();
    rows.push(row);
    row = [];
  };
  while (i < text.length) {
    const ch = text[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += ch;
      i++;
    } else if (ch === '"') {
      inQuotes = true;
      i++;
    } else if (ch === ',') {
      push();
      i++;
    } else if (ch === '\r') {
      i++;
    } else if (ch === '\n') {
      pushRow();
      i++;
    } else {
      cell += ch;
      i++;
    }
  }
  if (cell !== '' || row.length > 0) pushRow();
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

export function serializeCsvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function serializeCsv(rows: readonly (readonly string[])[]): string {
  return rows.map((row) => row.map(serializeCsvCell).join(',')).join('\n') + '\n';
}
