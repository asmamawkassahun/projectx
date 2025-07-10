import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighterPrism } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Markdown components for consistent rendering
const MarkdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighterPrism
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        className="rounded-md my-4 shadow-lg"
        showLineNumbers
        wrapLines
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighterPrism>
    ) : (
      <code className={`${className} px-1.5 py-0.5 rounded-md bg-gray-100 font-mono text-sm border border-gray-200`} {...props}>
        {children}
      </code>
    );
  },
  img({ node, ...props }: any) {
    return (
      <span className="flex justify-center my-6 transition-all duration-300 hover:scale-[1.01]">
        <img className="max-w-full rounded-lg shadow-xl border border-gray-200 filter saturate-[0.95]" {...props} />
      </span>
    );
  },
  a({ node, ...props }: any) {
    return (
      <a 
        {...props} 
        className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 font-medium no-underline border-b border-emerald-500/20 hover:border-emerald-500/50 pb-[1px]" 
        target="_blank"
        rel="noopener noreferrer"
      />
    );
  },
  blockquote({ node, ...props }: any) {
    return (
      <blockquote className="border-l-4 border-emerald-500/70 pl-5 py-0.5 my-6 bg-gray-100/50 pr-4 rounded-r-md text-gray-600 italic shadow-sm" {...props} />
    );
  },
  h1({ node, ...props }: any) {
    return <h1 className="text-2xl font-bold mt-10 mb-5 pb-2 border-b border-gray-200 text-gray-800" {...props} />;
  },
  h2({ node, ...props }: any) {
    return <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-5 before:bg-emerald-500/70 before:rounded-sm" {...props} />;
  },
  h3({ node, ...props }: any) {
    return <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-700" {...props} />;
  },
  p({ node, ...props }: any) {
    return <p className="my-4 leading-relaxed text-gray-700" {...props} />;
  },
  ul({ node, ...props }: any) {
    return <ul className="my-4 ml-6 space-y-2 list-disc marker:text-emerald-500" {...props} />;
  },
  ol({ node, ...props }: any) {
    return <ol className="my-4 ml-6 space-y-2 list-decimal marker:text-emerald-600 marker:font-medium" {...props} />;
  },
  li({ node, ...props }: any) {
    return <li className="pl-1 text-gray-700" {...props} />;
  },
  hr({ node, ...props }: any) {
    return <hr className="my-8 border-gray-200" {...props} />;
  },
  table({ node, ...props }: any) {
    return (
      <div className="my-6 w-full overflow-x-auto rounded-md shadow-md">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    );
  },
  thead({ node, ...props }: any) {
    return <thead className="bg-gray-100" {...props} />;
  },
  tbody({ node, ...props }: any) {
    return <tbody className="divide-y divide-gray-200" {...props} />;
  },
  tr({ node, ...props }: any) {
    return <tr className="border-b border-gray-200" {...props} />;
  },
  th({ node, ...props }: any) {
    return <th className="px-4 py-3 text-left font-medium text-gray-700 border-b-2 border-gray-300" {...props} />;
  },
  td({ node, ...props }: any) {
    return <td className="px-4 py-3 text-gray-700 border-gray-200" {...props} />;
  },
};

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose max-w-none px-2 md:px-4 py-2 md:py-6 mx-auto md:max-w-3xl">
      <ReactMarkdown
        components={MarkdownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 