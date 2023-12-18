import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import React, { FC, useState, forwardRef, ReactNode } from 'react';
import { Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import {
  NotificationTypes,
  useNotificationItems,
} from './shared/hooks/use-notifications';
import {
  isDesktopMediaQuery,
  isTabletMediaQuery,
} from './shared/utils/responsiveness';

type NotificationContainerProps = {
  type: NotificationTypes;
};

const gap = '2rem';

const getNotificationBackgroundColor = ({
  type,
}: NotificationContainerProps) => {
  if (type === 'error') {
    return 'rgba(234, 19, 19, 0.8)';
  }

  if (type === 'warning') {
    return 'rgba(252, 248, 227, 0.8)';
  }

  return 'rgba(92, 184, 92, 0.8)';
};

const getNotificationColor = ({ type }: NotificationContainerProps) => {
  if (type === 'warning') {
    return 'rgb(138, 109, 59)';
  }

  return '#fdfdfd';
};

const Container = forwardRef<
  HTMLDivElement,
  NotificationContainerProps & {
    children: ReactNode;
  }
>(({ type, children }, ref) => (
  <div
    ref={ref}
    style={{
      pointerEvents: 'auto',
      color: getNotificationColor({ type }),
      backgroundColor: getNotificationBackgroundColor({ type }),
      padding: '1.5rem',
      display: 'grid',
      gridAutoFlow: 'column',
      gridGap: '1.5rem',
      gridTemplateColumns: '1fr',
      alignItems: 'start',
      marginBottom: gap,
    }}
  >
    {children}
  </div>
));
Container.displayName = 'Container';

export type NotificationProps = {
  type: NotificationTypes;
  children?: ReactNode;
  handleClose: () => void;
};

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ handleClose, children, type }, ref) => {
    return (
      <Container ref={ref} type={type}>
        <div>{children}</div>
        <Button
          type="button"
          onClick={handleClose}
          variant="custom"
          className="crossicon"
          style={{ borderColor: 'white' }}
        >
          <FontAwesomeIcon
            icon={faTimes as any}
            size="lg"
            style={{ color: 'white', height: '20px' }}
            aria-label="Close notification"
          />
        </Button>
      </Container>
    );
  }
);

Notification.displayName = 'Notification';

const Placement: FC = ({ children }) => (
  <div
    style={{
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      margin: '6rem 2rem',
      zIndex: 1000000,
    }}
  >
    {children}
  </div>
);

const Size: FC = ({ children }) => {
  const isTablet = useMediaQuery(isTabletMediaQuery);
  const isDesktop = useMediaQuery(isDesktopMediaQuery);
  return (
    <div
      style={{
        width: isTablet || isDesktop ? '25%' : '90%',
      }}
    >
      {children}
    </div>
  );
};

export const Notifications: FC = () => {
  const [refMap] = useState(() => new WeakMap());
  const { items, remove } = useNotificationItems();

  const variants = {
    initial: {
      display: 'flex',
      justifyContent: 'flex-end',
      opacity: 0,
      x: 0,
      y: '4rem',
    },
    enter: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      x: '100rem',
    },
  };
  return (
    <Placement>
      <AnimatePresence>
        {items.map((item) => {
          return (
            <motion.div
              initial="initial"
              animate="enter"
              exit="exit"
              key={item.id}
              variants={variants}
              layout
            >
              <Size>
                <Notification
                  ref={(ref) => ref && refMap.set(item, ref)}
                  type={item.type}
                  handleClose={() => remove(item.id)}
                >
                  {item.children}
                </Notification>
              </Size>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Placement>
  );
};
