import { useMemoOne } from 'use-memo-one';
import { v4 as uuid } from 'uuid';

export function createId() {
  return `u-${uuid()}`;
}

export function useId() {
  const id = useMemoOne(createId, []);
  return id;
}
