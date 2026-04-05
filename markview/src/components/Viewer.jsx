import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

export default function Viewer({ file, onToggleSidebar, sidebarOpen }) {
  if (!file) {
    return (
      <main className="viewer empty">
        <p>Select a file from the sidebar</p>
      </main>
    )
  }

  return (
    <main className="viewer">
      <div className="viewer-header">
        {!sidebarOpen && (
          <button className="sidebar-toggle" onClick={onToggleSidebar} title="Open sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <div className="viewer-breadcrumb">
          {file.path.split('/').map((part, i, arr) => (
            <span key={i}>
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              <span className={i === arr.length - 1 ? 'breadcrumb-active' : 'breadcrumb-dim'}>{part}</span>
            </span>
          ))}
        </div>
      </div>
      <article className="viewer-content markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
        >
          {file.content}
        </ReactMarkdown>
      </article>
    </main>
  )
}
