import { useEffect } from 'react';

const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
) => {
  useEffect(() => {
    if (!textAreaRef) return;

    textAreaRef.style.height = '0px';

    const { scrollHeight } = textAreaRef;

    textAreaRef.style.height = scrollHeight ? `${scrollHeight}px` : 'auto';
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;
