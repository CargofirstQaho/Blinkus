import { useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';

export function useOverridableAmount(control, setValue, name, computed) {
  const watched = useWatch({ control, name });
  const prevRef = useRef(computed);
  useEffect(() => {
    const current = parseFloat(watched);
    const prev    = prevRef.current;
    if (Number.isNaN(current) || Math.abs(current - prev) < 0.005) {
      setValue(name, Number(computed.toFixed(2)), { shouldValidate: true });
    }
    prevRef.current = computed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computed]);
  return watched;
}
