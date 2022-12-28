import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';

const useLockBodyScroll = () => {
  const lockScroll = (element: HTMLElement) => {
    disableBodyScroll(element, { reserveScrollBarGap: true });
  };

  const unlockScroll = (element: HTMLElement) => {
    enableBodyScroll(element);
  };

  const clearLocks = () => {
    clearAllBodyScrollLocks();
  };

  return { lockScroll, unlockScroll, clearLocks } as const;
};

export default useLockBodyScroll;
