import { useEffect, useCallback, RefObject, useState } from 'react';

function withinContainer(
  ref: RefObject<HTMLElement>,
  target: EventTarget | null
) {
  return Boolean(
    ref.current && target instanceof Node && ref.current.contains(target)
  );
}

type WhileActiveOptions = {
  initialActive?: boolean;
};

export function useWhileActive(
  ref: RefObject<HTMLElement>,
  { initialActive = false }: WhileActiveOptions = {}
) {
  const [active, setActive] = useState(initialActive);

  const [mousedownInside, setMousedownInside] = useState(false);
  const handleMousedown = useCallback(
    (event: MouseEvent) => {
      if (withinContainer(ref, event.target)) {
        setMousedownInside(true);
      } else {
        setMousedownInside(false);
        setActive(false);
      }
    },
    [ref]
  );

  const handleFocusout = useCallback(
    (event: FocusEvent) => {
      if (!document.hasFocus()) return;
      if (withinContainer(ref, event.relatedTarget)) return;
      if (!event.relatedTarget && mousedownInside) return;

      setActive(false);
    },
    [mousedownInside, ref]
  );

  const handleFocusin = useCallback(
    (event: FocusEvent) => {
      if (withinContainer(ref, event.target)) return;

      setActive(false);
    },
    [ref]
  );

  useEffect(() => {
    if (active) {
      document.addEventListener('focusout', handleFocusout);
      document.addEventListener('focusin', handleFocusin);
      document.addEventListener('mousedown', handleMousedown);
      return () => {
        document.removeEventListener('focusout', handleFocusout);
        document.removeEventListener('focusin', handleFocusin);
        document.removeEventListener('mousedown', handleMousedown);
      };
    }
  }, [active, handleFocusin, handleFocusout, handleMousedown]);

  return [active, setActive] as const;
}
