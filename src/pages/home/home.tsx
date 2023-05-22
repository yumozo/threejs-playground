import React, { useEffect, useRef, useState } from 'react'
import { SceneLoader } from './sceneLoader'
import { use3D } from '@context/context3D'

export default function Home() {
  const scene = use3D()
  const [rotationDegree, setRotationDegree] = useState(-90)
  const sceneRef = useRef(null)
  const inputRef = useRef(null)
  function handleRotationChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const value = e.target.value
    setRotationDegree(Number(value))
  }
  function handleSubmit(e) {
    e.preventDefault()
  }

  useEffect(() => {
    console.log(scene)

    scene.init()
  }, [sceneRef])

  useEffect(() => {
    if (scene) {
      scene.rotatePlane(rotationDegree)
    }
  }, [rotationDegree])

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Hello There!</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} action="">
          <label htmlFor="rotation degree">rotation degree</label>
          <input
            ref={inputRef}
            style={{ width: '90px' }}
            value={rotationDegree}
            onChange={handleRotationChange}
            type="number"
            name="rotation degree"
            id="rotation-degree"
          />
        </form>
      </div>
      <div id="scene" ref={sceneRef}></div>
    </>
  )
}
