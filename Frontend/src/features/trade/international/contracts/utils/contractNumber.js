// Contract numbers are case-insensitive and stored in normalized form:
// uppercased, trimmed, with internal whitespace collapsed to single spaces.
export function normalizeContractNumber(value) {
  return (value || '')
    .toString()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}
