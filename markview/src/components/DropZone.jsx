import { useState, useRef, useCallback } from 'react'

export default function DropZone({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    setIsDragging(false)

    const items = e.dataTransfer.items
    const allFiles = []

    const readEntries = (dirReader) =>
      new Promise((resolve) => {
        const entries = []
        const read = () => {
          dirReader.readEntries((batch) => {
            if (batch.length === 0) return resolve(entries)
            entries.push(...batch)
            read()
          })
        }
        read()
      })

    const processEntry = async (entry) => {
      if (entry.isFile) {
        return new Promise((resolve) => {
          entry.file((file) => {
            Object.defineProperty(file, 'webkitRelativePath', {
              value: entry.fullPath.replace(/^\//, ''),
            })
            allFiles.push(file)
            resolve()
          })
        })
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader()
        const entries = await readEntries(dirReader)
        await Promise.all(entries.map(processEntry))
      }
    }

    if (items) {
      const entries = []
      for (const item of items) {
        const entry = item.webkitGetAsEntry?.()
        if (entry) entries.push(entry)
      }
      await Promise.all(entries.map(processEntry))
      if (allFiles.length > 0) onUpload(allFiles)
    }
  }, [onUpload])

  const handleInputChange = (e) => {
    if (e.target.files?.length) onUpload(Array.from(e.target.files))
  }

  return (
    <div className="dropzone-page">
      <div className="dropzone-header">
        <div className="logo-mark">M</div>
        <h1>MarkView</h1>
        <p className="tagline">Beautiful Markdown folder viewer. Private. No uploads to any server.</p>
      </div>

      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <div className="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
            <line x1="12" y1="10" x2="12" y2="16" />
            <line x1="9" y1="13" x2="15" y2="13" />
          </svg>
        </div>
        <p className="dropzone-title">Drop a folder here</p>
        <p className="dropzone-subtitle">or click to browse</p>
        <p className="dropzone-hint">Supports .md, .mdx, and .markdown files</p>
      </div>

      <div className="features">
        <div className="feature">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>100% Private</span>
        </div>
        <div className="feature">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Instant Preview</span>
        </div>
        <div className="feature">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Full-Text Search</span>
        </div>
      </div>
    </div>
  )
}
