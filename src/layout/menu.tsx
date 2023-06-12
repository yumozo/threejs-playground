import { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"

const StyledNavButton = styled.a`
  padding: 1em;
  width: 100%;
  text-align: center;

  /* text-decoration: none; */
  color: white;
  &:visited,
  &:link {
    color: white;
  }
  &:hover,
  &:active {
    color: #ee6676;
  }

  font-weight: 600;
`

const StyledMenu = styled.aside`
  transition: 0.2333s;
  position: absolute;
  display: flex;
  /* flex-direction: column;
  justify-content: center; */
  visibility: ${(props) => (props.menuOpen ? "visible" : "hidden")};
  opacity: ${(props) => (props.menuOpen ? "1" : "0")};
  z-index: 999;
  top: 0;
  right: 0;

  width: min(75vw, 400px);
  height: 100vh;

  font-size: 1.125rem; 

  /* background: linear-gradient(to right, transparent, 4%, #38536bfe); */
  background: var(--slate-gray);
  ul {
    padding: 0;
    width: 100%;
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`

const StyledMenuButton = styled.button`
  background-color: var(--slate-gray);
  color: var(--beige);

  border: 2px;
  border-radius: 10px;
  padding: 0.9em;

  cursor: pointer;
`

export default function MobileMenu({ navigate }) {
  const [isShown, setShown] = useState(false)
  // Click outside handler
  const selfRef = useRef(null)
  useEffect(() => {
    function handleClickOutside(e) {
      if (selfRef.current && !selfRef.current.contains(e.target)) {
        setShown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isShown, selfRef])

  function handleClick() {
    setShown(!isShown)
  }

  const pages = ["about", "projects", "contact", "blog"]

  return (
    <>
      <StyledMenuButton style={{ zIndex: 2 }} onClick={handleClick}>
        {isShown ? "❌" : "🍔"}
      </StyledMenuButton>
      <StyledMenu ref={selfRef} menuOpen={isShown}>
        <ul>
          {pages.map((page) => {
            return (
              <li key={page}>
                <StyledNavButton
                  href={"/#" + page}
                  onClick={() => {
                    // navigate(page)
                    setShown(!isShown)
                  }}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </StyledNavButton>
              </li>
            )
          })}
        </ul>
      </StyledMenu>
    </>
  )
}
