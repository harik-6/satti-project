import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StreamingMarkup({ content, speed = 15, onComplete, sx }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!content) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(content.slice(0, i + 1));
      i++;
      if (i >= content.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [content, speed]);

  return (
    <div style={sx} className="prose">
      <Markdown remarkPlugins={[remarkGfm]}>{displayed}</Markdown>
    </div>
  );
} 