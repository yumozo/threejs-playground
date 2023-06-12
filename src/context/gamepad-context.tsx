import { createContext, useEffect, useState } from 'react'
import { GamepadInput, GamepadMapping } from '@game/system/input/gamepad-input'
import { InputManager } from '@game/system/input/input-manager'

// Create a context for the gamepad input state
export const GamepadInputContext = createContext<{
  gamepadInput: GamepadInput | null
}>({
  gamepadInput: null
})

interface GamepadInputProviderProps {
  children: React.ReactNode
  gamepadMapping: GamepadMapping
}

// Create a component to provide the gamepad input state to the app
export function GamepadInputProvider({
  children,
  gamepadMapping
}: GamepadInputProviderProps): React.ReactElement<GamepadInputProviderProps> {
  const [gamepadInput, setGamepadInput] = useState<GamepadInput | null>(null)
  const inputManager = InputManager.getInstance()

  function handleGamepadConnected() {
    setGamepadInput(inputManager.gamepadInput)
  }

  function handleGamepadDisconnected() {
    setGamepadInput(null)
  }

  useEffect(() => {
    inputManager.register('gamepadconnected', handleGamepadConnected)
    inputManager.register('gamepaddisconnected', handleGamepadDisconnected)

    return () => {
      inputManager.unregister('gamepadconnected', handleGamepadConnected)
      inputManager.unregister('gamepaddisconnected', handleGamepadDisconnected)
      window.removeEventListener('gamepadconnected', inputManager.connectGamepad)
      window.removeEventListener('gamepaddisconnected', inputManager.disconnectGamepad)
    }
  }, [gamepadMapping, inputManager, gamepadInput])

  return (
    <GamepadInputContext.Provider value={{ gamepadInput }}>{children}</GamepadInputContext.Provider>
  )
}