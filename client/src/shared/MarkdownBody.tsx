import ReactMarkdown from 'react-markdown';

interface MarkdownBodyProps {
  markdown: string;
  className?: string;
}

/**
 * Public Markdown renderer (Phase 6.7). Uses react-markdown — no raw HTML pass-through.
 * @see docs/phase-6-open-questions.md P6-3
 */
function MarkdownBody({ markdown, className = 'pack-prose' }: MarkdownBodyProps) {
  if (!markdown) {
    return null;
  }

  return (
    <div className={className}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}

export default MarkdownBody;
