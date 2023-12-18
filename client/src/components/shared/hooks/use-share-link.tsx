import { useMemoOne } from 'use-memo-one';

export function useShareLink() {
  const shareLink = useMemoOne(
    () =>
      `${window.location.protocol + '//' + window.location.host}${
        window.location.pathname
      }`,
    [window.location]
  );
  return shareLink;
}
