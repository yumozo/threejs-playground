import styled from 'styled-components'

interface Props {
  position: number
}

const Section = styled.ul`
  padding: 0;
  margin: 0;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  button {
    opacity: 90%;

    width: 100%;
    margin-bottom: 0.25rem;
    padding: 0.25rem 0.5rem;

    font-family: var(--font-mono);
    text-align: center;
    color: white;

    background: var(--slate-gray);
    border: 1px solid var(--gainsboro);
    border-radius: 8px;
    font-weight: 600;

    &:hover {
      cursor: pointer;
      background: var(--steel-blue);
      border-color: var(--baby-blue);
    }
  }
`

const Wrapper = styled.div<Props>`
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  position: absolute;
  bottom: ${(props) => (props.position ? props.position : '200px')};
  right: 20px;

  border: 1px solid #c0c0c088;
  background: #31313188;
  border-radius: 10px;
  padding: 0.25rem 0.5rem;

  font-family: var(--font-mono);
  color: white;

  h3 {
    text-align: center;
  }
`

export default function Menu() {
  return (
    <Wrapper>
      <h3>Menu</h3>
      <Section>
        <ul>
          <li>
            <button>Load map</button>
          </li>
          <li>
            <button>Load player</button>
          </li>
          <li>
            <button>Reset</button>
          </li>
        </ul>
      </Section>
    </Wrapper>
  )
}
