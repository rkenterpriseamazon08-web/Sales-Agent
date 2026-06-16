import ReactMarkdown from 'react-markdown';

export default function MarkdownViewer({ content, className = '' }) {
  if (!content?.trim()) {
    return (
      <div className="text-sm text-slate-400 dark:text-slate-500 italic py-4">
        No content available yet.
      </div>
    );
  }

  return (
    <div className={`prose-sales ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
