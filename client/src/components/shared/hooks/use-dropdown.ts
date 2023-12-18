import { Options as PopperOptions, createPopper } from '@popperjs/core';
import { useRef, useState, useEffect } from 'react';
import { Modifier, usePopper } from 'react-popper-2';
import { useWhileActive } from './use-while-active';

type Options<Modifiers> = Omit<Partial<PopperOptions>, 'modifiers'> & {
  createPopper?: typeof createPopper;
  modifiers?: ReadonlyArray<Modifier<Modifiers>>;
  initialActive?: boolean;
};

export function useDropdown<Modifiers>(options: Options<Modifiers> = {}) {
  const { initialActive, ...popperOptions } = options;

  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const popper = usePopper(referenceElement, popperElement, popperOptions);

  const wrapperElement = useRef<HTMLDivElement>(null);
  const [active, setActive] = useWhileActive(wrapperElement, { initialActive });

  const [initialCorrection, setInitialCorrection] = useState(false);
  useEffect(() => {
    if (popper.update && !initialCorrection) {
      popper.update();
      setInitialCorrection(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popper.update, initialCorrection]);

  return {
    active,
    setActive,
    referenceElement,
    setReferenceElement,
    setPopperElement:
      process.env.NODE_ENV === 'test' ? () => {} : setPopperElement,
    wrapperElement,
    ...popper,
  };
}
