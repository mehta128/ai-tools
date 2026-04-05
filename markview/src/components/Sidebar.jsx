import { useMemo } from 'react'

function buildTree(files) {
  const tree = {}
  for (const file of files) {
    const parts = file.path.split('/')
    let current = tree
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = { __children: {} }
      current = current[parts[i]].__children
    }
    current[file.name] = { __file: file }
  }
  return tree
}

function TreeNode({ name, node, activeFile, onSelect, depth = 0 }) {
  if (node.__file) {
    const isActive = activeFile?.path === node.__file.path
    return (
      <button
        className={`tree-file ${isActive ? 'active' : ''}`}
        onClick={() => onSelect(node.__file)}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        title={node.__file.path}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span>{name.replace(/\.(md|mdx|markdown)$/i, '')}</span>
      </button>
    )
  }

  const children = node.__children || node
  return (
    <div className="tree-folder">
      <div className="tree-folder-name" style={{ paddingLeft: `${12 + depth * 16}px` }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
        </svg>
        <span>{name}</span>
      </div>
      {Object.entries(children)
        .filter(([key]) => key !== '__children')
        .sort(([a, nodeA], [b, nodeB]) => {
          const aIsFile = !!nodeA.__file
          const bIsFile = !!nodeB.__file
          if (aIsFile !== bIsFile) return aIsFile ? 1 : -1
          return a.localeCompare(b)
        })
        .map(([key, child]) => (
          <TreeNode key={key} name={key} node={child} activeFile={activeFile} onSelect={onSelect} depth={depth + 1} />
        ))}
    </div>
  )
}

export default function Sidebar({ files, activeFile, onSelect, onReset, searchQuery, onSearch, totalCount, isOpen, onToggle }) {
  const tree = useMemo(() => buildTree(files), [files])

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand" onClick={onReset} title="Start over">
          <div className="logo-mark small">M</div>
          <span>MarkView</span>
        </div>
        <button className="sidebar-close" onClick={onToggle} title="Close sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </button>
      </div>

      <div className="sidebar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search files & content..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="sidebar-meta">
        {files.length === totalCount
          ? `${totalCount} file${totalCount !== 1 ? 's' : ''}`
          : `${files.length} of ${totalCount} files`}
      </div>

      <nav className="sidebar-tree">
        {Object.entries(tree)
          .sort(([a, nodeA], [b, nodeB]) => {
            const aIsFile = !!nodeA.__file
            const bIsFile = !!nodeB.__file
            if (aIsFile !== bIsFile) return aIsFile ? 1 : -1
            return a.localeCompare(b)
          })
          .map(([key, node]) => (
            <TreeNode key={key} name={key} node={node} activeFile={activeFile} onSelect={onSelect} />
          ))}
      </nav>

      <div className="sidebar-footer">
        <button className="reset-btn" onClick={onReset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Open different folder
        </button>
      </div>
    </aside>
  )
}
