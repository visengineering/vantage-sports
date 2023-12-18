import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { v4 as uuid } from 'uuid';
import { assertContext } from '../utils/assert-context';
import { useMounted } from './use-mounted';

export type NotificationTypes = 'error' | 'success' | 'warning';

export type NotifyItem = {
  children: ReactNode;
  type: NotificationTypes;
};

type ReceivedNotifyItem = NotifyItem & {
  id: string;
};

type State = {
  items: ReceivedNotifyItem[];
};

const initialState: State = { items: [] };

type Action =
  | {
      type: 'add';
      item: ReceivedNotifyItem;
    }
  | {
      type: 'remove';
      id: string;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'add':
      return { ...state, items: [...state.items, action.item] };
    case 'remove':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    default:
      throw new Error(`Found unknown action.type in ${action}.`);
  }
};

type NotificationItemsContextValue = State & {
  remove: (id: string) => void;
};

// pass undefined as any, because we run assertContext at runtime
const NotificationItemsContext = createContext<NotificationItemsContextValue>(
  undefined as any
);

export function useNotificationItems() {
  const context = useContext(NotificationItemsContext);
  assertContext(context, 'NotificationItems');
  return context;
}

export type NotificationContextValue = (item: NotifyItem) => void;

// pass undefined as any, because we run assertContext at runtime
const NotificationContext = createContext<NotificationContextValue>(
  undefined as any
);

export function useNotification() {
  const context = useContext(NotificationContext);
  assertContext(context, 'Notification');
  return context;
}

export type NotificationsProviderProps = {
  initialItems?: NotifyItem[];
};

export const NotificationsProvider: FC<NotificationsProviderProps> = ({
  children,
  initialItems = [],
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const mounted = useMounted();

  const notify = useCallback(
    (item: Omit<ReceivedNotifyItem, 'id'>) => {
      const id = uuid();
      dispatch({ type: 'add', item: { ...item, id } });
      setTimeout(
        () => {
          if (mounted.current) {
            dispatch({ type: 'remove', id });
          }
        },
        item.type === 'error' ? 20000 : 5000
      );
    },
    [mounted]
  );

  const remove = useCallback(
    (id: string) => dispatch({ type: 'remove', id }),
    []
  );

  useEffect(() => {
    initialItems.forEach(notify);
  }, [initialItems, notify]);

  return (
    <NotificationItemsContext.Provider value={{ ...state, remove }}>
      <NotificationContext.Provider value={notify}>
        {children}
      </NotificationContext.Provider>
    </NotificationItemsContext.Provider>
  );
};
