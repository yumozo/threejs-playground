import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { gameContext } from '@context/game-context'
import { GlobalStyle } from '@styles/global'
import { Game } from '@game/game'
import GameGUI from '@pages/game/game-page'
import HomePage from '@pages/home/home'

function main() {
  document.body.innerHTML = `
  <div id="root"></div>
  <div id="scene-container"></div>
  `

  const container = document.getElementById('scene-container')
  if (!container) throw new Error("Failed to find the scene-container element")
  container.style.position = 'absolute'
  container.style.top = '0'
  container.style.left = '0'
  container.style.zIndex = '-999'
  container.style.width = '100%'
  container.style.height = '100%'

  const game = new Game(container)

  function App() {
    // const [gameScene, setGameScene] = useState(game)
    const [status, setStatus] = useState({ gameStarted: false })

    return (
      <>
        <gameContext.Provider value={game}>
          <GlobalStyle />
          {status.gameStarted ? <GameGUI /> : <HomePage status={status} setStatus={setStatus} />}
        </gameContext.Provider>
      </>
    )
  }
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Failed to find the root element')
  const root = createRoot(rootElement)

  root.render(<App />)

  // game.start()
}

main()
