import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  line-height: 1.15;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .info {
    color: var(--silver);
  }
  .value {
    color: var(--gainsboro);
  }
`

export default function AppInfoLabel() {
  return (
    <Wrapper>
      <ul>
        <li>
          <span className="info">version:</span>{' '}
          <span className="value">0.1.0</span>
        </li>
        <li>
          <span className="info">branch:</span>{' '}
          <span className="value">master</span>
        </li>
        <li>
          <span className="info">mode:</span> <span className="value">dev</span>
        </li>
      </ul>
    </Wrapper>
  )
}
