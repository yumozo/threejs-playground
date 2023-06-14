import { useContext, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { GamepadInputContext } from '@context/gamepad-context'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: 10px;
  left: 200px;

  border: solid 1px var(--gainsboro);
  border-radius: 20px;
  background: #ffffff18;
`

const StickWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  height: 200px;
  width: 200px;

  svg {
    width: 154px;
    height: 154px;
  }
`

export default function GamepadControlsCheck() {
  const { gamepadInput } = useContext(GamepadInputContext)

  const [buttonPresses, setButtonPresses] = useState({})

  useEffect(() => {
    function updateButtonPresses() {
      // console.log('state: ', buttonPresses)

      const newButtonPresses = {}
      for (const buttonName in gamepadInput?.mapping) {
        let button = gamepadInput.mapping[buttonName]
        if (buttonName.startsWith('GamepadAxis')) {
          // let axisData = gamepadInput.getAxis(buttonName)
          let axisData = gamepadInput.getAxis(button)
          newButtonPresses[button] = axisData
        } else {
          newButtonPresses[button] = gamepadInput.getButton(button)
        }
      }

      setButtonPresses(newButtonPresses)
      requestAnimationFrame(updateButtonPresses)
    }

    updateButtonPresses()

    return () => {}
  }, [gamepadInput])

  if (!gamepadInput) {
    return <h3>No gamepad connected</h3>
  }

  const gamepadButtonsDisplay = Object.keys(gamepadInput.mapping).map((buttonName) => {
    let button = gamepadInput.mapping[buttonName]
    // if (buttonName.startsWith('GamepadAxis')) {
      return (
        <tr key={buttonName}>
          <td style={{ textAlign: 'center' }}>{button}</td>
          <td>
            {buttonPresses[button] !== 0 ? (
              <span style={{ color: 'cyan' }}>{buttonPresses[button]?.toFixed(2)}</span>
            ) : (
              <span style={{ color: 'gray' }}>{buttonPresses[button]?.toFixed(2)}</span>
            )}
          </td>
        </tr>
      )
  })

  const gamepadAxisDisplay = (
    <Wrapper>
      <StickWrapper>
        <svg style={{ zIndex: 1 }}>
          <g transform="translate(78.5 78.5) scale(0.95, 0.95)">
            <circle
              cx="0"
              cy="0"
              r="78.5"
              fill="none"
              stroke="hsla(0,0%,100%,0.2)"
              strokeWidth="1"
            ></circle>
            <line
              x1="0"
              y1="-78.5"
              x2="0"
              y2="78.5"
              stroke="hsla(0,0%,100%,0.2)"
              strokeWidth="1"
            ></line>
            <line
              x1="-78.5"
              y1="0"
              x2="78.5"
              y2="0"
              stroke="hsla(0,0%,100%,0.2)"
              strokeWidth="1"
            ></line>
            <line
              x1="0"
              y1="0"
              x2={buttonPresses['LS_HORI'] * 78.5}
              y2={buttonPresses['LS_VERT'] * 78.5}
              stroke="hsl(0, 0%, 100%)"
              strokeWidth="1"
            ></line>
            <circle
              cx={buttonPresses['LS_HORI'] * 78.5}
              cy={buttonPresses['LS_VERT'] * 78.5}
              r="4"
              fill="hsl(0, 100%, 60%)"
            ></circle>
          </g>
        </svg>
      </StickWrapper>
      <StickWrapper>
        <svg style={{ zIndex: 1 }}>
          <g transform="translate(78.5 78.5) scale(0.95, 0.95)">
            <circle
              cx="0"
              cy="0"
              r="78.5"
              fill="none"
              stroke="hsla(0,0%,100%,0.2)"
              strokeWidth="1"
            ></circle>
            <line
              x1="0"
              y1="-78.5"
              x2="0"
              y2="78.5"
              stroke="hsla(0,0%,100%,0.2)"
              strokeWidth="1"
            ></line>
            <line
              x1="-78.5"
              y1="0"
              x2="78.5"
              y2="0"
              stroke="hsla(0,0%,100%,0.2)"
              strokeWidth="1"
            ></line>
            <line
              x1="0"
              y1="0"
              x2={buttonPresses['RS_HORI'] * 78.5}
              y2={buttonPresses['RS_VERT'] * 78.5}
              stroke="hsl(0, 0%, 100%)"
              strokeWidth="1"
            ></line>
            <circle
              cx={buttonPresses['RS_HORI'] * 78.5}
              cy={buttonPresses['RS_VERT'] * 78.5}
              r="4"
              fill="hsl(0, 100%, 60%)"
            ></circle>
          </g>
        </svg>
      </StickWrapper>
    </Wrapper>
  )

  return (
    <div className="Gamepads">
      <h3>Gamepad state</h3>
      <table>{gamepadButtonsDisplay}</table>
      {gamepadAxisDisplay}
    </div>
  )
}
