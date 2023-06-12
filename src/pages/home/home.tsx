import { useGame } from '@context/game-context'
import { styled } from 'styled-components'
import Layout from '@layout/layout'

const StyledLogin = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  /* text-align: center; */
  padding: 0;

  button {
    padding: 0.65em 0.5em;
    background: var(--light-salmon);
    font-weight: 500;
    font-family: var(--font-mono);
    font-size: 1.05rem;
    color: black;
    border-radius: 10px;

    &:focus,
    &:hover {
      background: var(--peach);
    }
  }
`

export default function HomePage({ status, setStatus }) {
  const game = useGame()
  if (!game) throw new Error("Game isn't initialized.")

  return (
    <Layout>
      <StyledLogin>
        <h1 style={{marginBottom: "1rem"}}>Welcome to the Game!</h1>

        <div>
          <button
            onClick={() => {
              if (status.gameStarted) {
                console.warn('Game is already running!')
              } else {
                setStatus({ ...status, gameStarted: true })
                game.start()
              }
            }}
          >
            Start
          </button>
        </div>
      </StyledLogin>
    </Layout>
  )
}
