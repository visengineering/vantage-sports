import React, {
  createContext,
  FC,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  ReactPortal,
  useContext,
  useEffect,
  useMemo,
  useState,
  VFC,
} from 'react';
import { createPortal } from 'react-dom';
import { TooltipDivider } from './Divider';
import { useDropdown } from './hooks/use-dropdown';
import { useId } from './hooks/use-id';
import { useMounted } from './hooks/use-mounted';
import { useParentZIndex } from './hooks/use-parent-z-index';

function safeCreatePortal(
  children: ReactNode,
  container: Element
): ReactPortal | ReactNode {
  return createPortal(children, container);
}

const borderRadius = 5;

export const tooltipContainerStyle = {
  backgroundColor: '#fcfcfc',
  borderRadius: '0.4rem',
  boxShadow: '0 0.3rem 0.6rem #25282c33',
  backgroundClip: 'padding-box',
  overflow: 'initial',
  maxWidth: '24rem',
  padding: '0.8rem 1.4rem',
  zIndex: 1,
};

/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
const Container = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ children, ...other }, ref) => (
    <span ref={ref} {...other}>
      {children}
    </span>
  )
);

type TargetProps = { 'aria-labelledby'?: string };

type Props = {
  initialActive?: boolean;
  content: ReactNode;
  children: (props: TargetProps) => ReactNode;
};

type Parent = { portalId: string; active: boolean };

const TooltipContext = createContext<Parent | null>(null);

export const Tooltip: VFC<Props> = (props) => {
  const parent = useContext(TooltipContext);

  if (parent) {
    return <TooltipChild {...props} parent={parent} />;
  } else {
    return <TooltipParent {...props} />;
  }
};

type ChildProps = {
  content: ReactNode;
  children: (props: TargetProps) => ReactNode;
  parent: Parent;
};

const TooltipChild: VFC<ChildProps> = ({ children, content, parent }) => {
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    if (parent.active) {
      setPortalContainer(document.getElementById(parent.portalId));
    } else {
      setPortalContainer(null);
    }
  }, [parent.active, parent.portalId]);

  return (
    <>
      {portalContainer &&
        createPortal(
          <div>
            <TooltipDivider />
            {content}
          </div>,
          portalContainer
        )}
      {children({})}
    </>
  );
};

const TooltipParent: VFC<Props> = ({ children, content, initialActive }) => {
  const id = useId();
  const portalId = `portal-${id}`;

  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const {
    active,
    setActive,
    wrapperElement,
    referenceElement,
    setReferenceElement,
    setPopperElement,
    styles,
    attributes,
  } = useDropdown({
    initialActive,
    placement: 'bottom',
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement,
          padding: borderRadius,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const mounted = useMounted();

  // https://github.com/chakra-ui/chakra-ui/pull/2272/files#diff-fbb684f6a8aac198338c32fb54583cdee24725847675fd1d9396f4767038c7bcR154
  useEffect(() => {
    if (!referenceElement) return;

    const onMouseLeave = () => {
      if (!mounted.current) return;
      setActive(false);
    };
    referenceElement.addEventListener('mouseleave', onMouseLeave);
    return () =>
      referenceElement.removeEventListener('mouseleave', onMouseLeave);
  }, [mounted, referenceElement, setActive]);

  useEffect(() => {
    const onScroll = () => {
      if (!mounted.current) return;
      setActive(false);
    };
    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll);
  }, [mounted, setActive]);

  const parentZIndex = useParentZIndex();

  const parent = useMemo(() => ({ active, portalId }), [active, portalId]);

  return (
    <TooltipContext.Provider value={parent}>
      <span ref={wrapperElement}>
        <span
          ref={setReferenceElement}
          tabIndex={0}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          onMouseEnter={() => setActive(true)}
          onClick={() => setActive(!active)}
        >
          {children({ 'aria-labelledby': active ? id : undefined })}
        </span>

        {active &&
          safeCreatePortal(
            <Container
              id={id}
              role="tooltip"
              ref={setPopperElement}
              style={{
                ...tooltipContainerStyle,
                ...styles.popper,
                zIndex: parentZIndex + 1,
              }}
              {...attributes.popper}
            >
              {content}
              <span id={portalId} />
              <div
                className="tooltip-arrow"
                ref={setArrowElement}
                style={styles.arrow}
              />
            </Container>,
            document.body
          )}
      </span>
    </TooltipContext.Provider>
  );
};
