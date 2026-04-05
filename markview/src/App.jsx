import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Viewer from './components/Viewer'
import DropZone from './components/DropZone'
import './App.css'

function App() {
  const [files, setFiles] = useState([])
  const [activeFile, setActiveFile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleFolderUpload = useCallback(async (fileList) => {
    const mdFiles = []
    for (const file of fileList) {
      const name = file.name.toLowerCase()
      if (name.endsWith('.md') || name.endsWith('.mdx') || name.endsWith('.markdown')) {
        const content = await file.text()
        const path = file.webkitRelativePath || file.name
        mdFiles.push({ name: file.name, path, content })
      }
    }
    mdFiles.sort((a, b) => a.path.localeCompare(b.path))
    setFiles(mdFiles)
    if (mdFiles.length > 0) setActiveFile(mdFiles[0])
  }, [])

  const handleReset = () => {
    setFiles([])
    setActiveFile(null)
    setSearchQuery('')
  }

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (files.length === 0) {
    return <DropZone onUpload={handleFolderUpload} />
  }

  return (
    <div className="app">
      <Sidebar
        files={filteredFiles}
        activeFile={activeFile}
        onSelect={setActiveFile}
        onReset={handleReset}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        totalCount={files.length}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <Viewer file={activeFile} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
    </div>
  )
}

export default App
