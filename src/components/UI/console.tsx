import { useEffect, useState } from 'react'

export default function Console() {
  const [logs, setLogs] = useState([])

  function handleLog(message: string) {
    setLogs([...logs, message])
  }

  useEffect(() => {
    // handleLog(...)
  }, [/* something just happened */])

  return (
    <div>
      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </div>
  )
}
