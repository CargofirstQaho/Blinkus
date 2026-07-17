import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  it('returns the initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('my-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns the stored value when localStorage already has data', () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('my-key', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('falls back to initial value when stored JSON is invalid', () => {
    window.localStorage.getItem.mockReturnValueOnce('not-json{');
    const { result } = renderHook(() => useLocalStorage('my-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('updates state and persists to localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('my-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('my-key', JSON.stringify('new-value'));
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 1));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('removes the value and resets to initial value', () => {
    const { result } = renderHook(() => useLocalStorage('my-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });
    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('default');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('my-key');
  });
});
