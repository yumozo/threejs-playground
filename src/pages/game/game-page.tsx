import { use3D, use3DGame } from '@context/context3D'
import { useEffect, useRef, useState } from 'react'
import Overlay from './overlay'

export default function GamePage() {
  const [keyPressed, setKeyPressed] = useState(null)
  // const game = use3DGame()
  const sceneRef = useRef(null)

  // useEffect(() => {
  //   game.init()
  // }, [sceneRef])

  return (
    <>
      <h1 style={{ textAlign: 'center', userSelect: 'none' }}>Hello There!</h1>
      {/* <div id="scene" ref={sceneRef}></div> */}
      <Overlay />
      <div id="start"></div>
    </>
  )
}
