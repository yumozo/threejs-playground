import { useGame } from '@context/game-context'
import React, { useEffect, useRef, useState } from 'react'
import Overlay from './overlay'
import AppInfoLabel from './app-info-label'
import Menu from './menu/menu'
import GamepadControlsCheck from '@UI/gamepad'
import { GamepadInputProvider } from '@context/gamepad-context'
import { gamepad_mapping } from '@game/system/config/gp_mapping'

export default function GamePage() {
  return (
    <>
      <h1 style={{ textAlign: 'center', userSelect: 'none' }}>Hello There!</h1>

      <AppInfoLabel />
      <Menu />
      <GamepadInputProvider gamepadMapping={gamepad_mapping}>
        <GamepadControlsCheck />
      </GamepadInputProvider>

      {/* <Overlay  /> */}
    </>
  )
}
