import { createRoot } from 'react-dom/client'
import Home from '@pages/home/home'
import GamePage from "@pages/game/game-page"
// import Game from '@pages/game/game'
import { context3D, gameContext, use3DGame } from '@context/context3D'
import { SceneLoader } from '@pages/home/sceneLoader'
import { ReactNode, useState } from 'react'
import { GlobalStyle } from '@styles/global'
import { Game } from '@game/game'

function main() {
  document.body.innerHTML = `
  <div id="root"></div>
  <div id="scene-container"></div>>
  `

  const container = document.getElementById('scene-container')
  container.style.position = 'absolute'
  container.style.top = '0'
  container.style.left = '0'
  container.style.zIndex = '-999'
  container.style.width = '100%'
  container.style.height = '100%'

  const game = new Game(container)

  // function App() {
  //   const [gameScene, setGameScene] = useState(game)

  //   return (
  //     <gameContext.Provider value={gameScene}>
  //       <GlobalStyle />
  //       <GamePage />
  //     </gameContext.Provider>
  //   )
  // }

  // const root = createRoot(document.getElementById('root'))
  // root.render(<App />)

  game.start()
}

main()
