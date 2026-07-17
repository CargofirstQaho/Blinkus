import { normalizeContractNumber } from './contractNumber';

describe('normalizeContractNumber', () => {
  it('uppercases the value', () => {
    expect(normalizeContractNumber('cn-2024-001')).toBe('CN-2024-001');
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalizeContractNumber('  CN-2024-001  ')).toBe('CN-2024-001');
  });

  it('collapses internal whitespace to a single space', () => {
    expect(normalizeContractNumber('CN  2024   001')).toBe('CN 2024 001');
  });

  it('returns an empty string for null or undefined', () => {
    expect(normalizeContractNumber(null)).toBe('');
    expect(normalizeContractNumber(undefined)).toBe('');
  });

  it('coerces non-string values to strings', () => {
    expect(normalizeContractNumber(12345)).toBe('12345');
  });

  it('returns an empty string for an empty input', () => {
    expect(normalizeContractNumber('')).toBe('');
  });
});
