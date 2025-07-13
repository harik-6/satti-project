import { Markup } from 'react-render-markup';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkupContent({ content }) {
  return (
    <div className="prose max-w-xl mx-auto my-8">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
} 