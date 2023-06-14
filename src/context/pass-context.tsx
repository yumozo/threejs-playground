import { createContext, useEffect, useState } from 'react'
import { PassManager } from '@game/system/post-processing/pass-manager'

// Create a context for the pass manager state
export const PassManagerContext = createContext<{
  passManager: PassManager | null
}>({
  passManager: null
})

interface PassManagerProviderProps {
  children: React.ReactNode
}

// Create a component to provide the pass manager state to the app
export function PassManagerProvider({
  children
}: PassManagerProviderProps): React.ReactElement<PassManagerProviderProps> {
  const [passManager, setPassManager] = useState<PassManager | null>(null)

  useEffect(() => {
    const pm = PassManager.getInstance()
    setPassManager(pm)

    // Clean up
    return () => {
      setPassManager(null)
    }
  }, [])

  return (
    <PassManagerContext.Provider value={{ passManager }}>{children}</PassManagerContext.Provider>
  )
}
