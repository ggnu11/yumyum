import {useEffect, useState} from 'react';

/**
 * 값을 debounce하는 훅
 * @param value - debounce할 값
 * @param delay - 지연 시간 (ms)
 * @returns debounce된 값
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 값을 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup 함수: value나 delay가 변경되면 이전 타이머를 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

