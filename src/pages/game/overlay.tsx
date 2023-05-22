import { styled } from "styled-components"

const Wrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  display: grid;
  grid-template-columns: repeat(3, 64px);
  grid-template-rows: repeat(2, 64px);
  gap: 0.05rem;

  div {
    background-color: var(--steel-blue);
    border: 1px var(--gainsboro) solid;
    border-radius: 20px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: var(--font-mono);
    font-size: 2.25rem;
    color: var(--light-gray);
  }
  #overlay-up {
    grid-column: 2;
    grid-row: 1;
  }
  #overlay-left {
    grid-column: 1;
    grid-row: 2;
  }
  #overlay-down {
    grid-column: 2;
    grid-row: 2;
  }
  #overlay-right {
    grid-column: 3;
    grid-row: 2;
  }
`

export default function Overlay() {
  return (
    <Wrapper>
      <div id="overlay-up">▲</div>
      <div id="overlay-left">◄</div>
      <div id="overlay-down">▼</div>
      <div id="overlay-right">►</div>
    </Wrapper>
  )
}