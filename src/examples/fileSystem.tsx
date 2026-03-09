import puter from '@heyputer/puter.js'
import { useMemo, useState } from 'react'

const getDemoPath = () => {
  if (puter.appDataPath && puter.path?.join) {
    return puter.path.join(puter.appDataPath, 'puterjs-demo.txt')
  }
  return 'puterjs-demo.txt'
}

const getCopyPath = (demoPath: string) => {
  if (puter.appDataPath && puter.path?.join) {
    return puter.path.join(puter.appDataPath, 'puterjs-demo-clone.txt')
  }
  return demoPath.replace(/\.txt$/, '-clone.txt')
}

const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error)

export const FileSystemExample = () => {
  const demoPath = useMemo(() => getDemoPath(), [])
  const copyPath = useMemo(() => getCopyPath(demoPath), [demoPath])
  const [status, setStatus] = useState<string>('Idle')
  const [fileContents, setFileContents] = useState<string>('')
  const [copyContents, setCopyContents] = useState<string>('')

  const writeSampleFile = async () => {
    setStatus('Writing sample file...')
    try {
      await puter.fs.write(demoPath, `Hello from Puter.js at ${new Date().toISOString()}`)
      setStatus(`Wrote sample text to ${demoPath}`)
    } catch (error) {
      setStatus(`Write failed: ${getErrorMessage(error)}`)
    }
  }

  const readSampleFile = async () => {
    setStatus('Reading file...')
    try {
      const blob = await puter.fs.read(demoPath)
      const text = await blob.text()
      setFileContents(text)
      setStatus('Read succeeded')
    } catch (error) {
      setStatus(`Read failed: ${getErrorMessage(error)}`)
    }
  }

  const cloneFile = async () => {
    setStatus('Cloning file...')
    try {
      await puter.fs.copy(demoPath, copyPath)
      const blob = await puter.fs.read(copyPath)
      const text = await blob.text()
      setCopyContents(text)
      setStatus(`Cloned to ${copyPath}`)
    } catch (error) {
      setStatus(`Clone failed: ${getErrorMessage(error)}`)
    }
  }

  return (
    <section className="card stack">
      <div className="stack">
        <h2>Puter File System</h2>
        <p>Creates and reads a sample file at <code>{demoPath}</code>. Uses your app data folder when available.</p>
      </div>

      <div className="actions">
        <button onClick={writeSampleFile}>Write file</button>
        <button onClick={readSampleFile}>Read file</button>
        <button onClick={cloneFile}>Clone file</button>
      </div>

      <p className="status">Status: {status}</p>

      {fileContents && (
        <div className="callout">
          <strong>File contents</strong>
          <pre>{fileContents}</pre>
        </div>
      )}

      {copyContents && (
        <div className="callout">
          <strong>Clone contents</strong>
          <p className="status">Path: <code>{copyPath}</code></p>
          <pre>{copyContents}</pre>
        </div>
      )}
    </section>
  )
}
