import { useState, useEffect, useRef } from 'react';

export const useAnimatedText = (fullText: string, speed = 10) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset when fullText changes
    if (indexRef.current === 0 || fullText.length < displayedText.length) {
      setDisplayedText('');
      indexRef.current = 0;
    }

    if (!fullText) {
      setDisplayedText('');
      return;
    }

    // If we've already displayed all the text, just set it
    if (indexRef.current >= fullText.length) {
      setDisplayedText(fullText);
      return;
    }

    const intervalId = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setDisplayedText(fullText.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [fullText, speed]);

  return displayedText;
};
