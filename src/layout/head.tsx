import styled from 'styled-components'
import { useTransition } from 'react'

import MobileMenu from './menu'

const StyledHeader = styled.header`
  /* position: -webkit-sticky;
  position: sticky; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 998;
  padding: 0 50px;

  @media (max-width: 480px) {
    padding: 0 25px;
  }
  width: 100%;
  height: 100px;
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 999;
`

export default function Head({ navigate }) {
  return (
    <StyledHeader>
      <Nav>
        <div>
          <a
            onClick={() => {
              navigate('home')
            }}
            style={{ cursor: 'pointer', fontSize: '2rem' }}
          >
            🏠
          </a>

        </div>
        <MobileMenu navigate={navigate} />
      </Nav>
    </StyledHeader>
  )
}
