import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function RoadmapDisplay({ roadmapText }) {
    return (
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-xl border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-gray-700 pb-2">
                Project Roadmap & Implementation
            </h2>
            <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                    children={roadmapText}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                />
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                />
            </div>
        </div>
    );
}