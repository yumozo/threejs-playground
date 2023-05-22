import { createGlobalStyle } from "styled-components"
import { variables } from "@styles/variables"

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  ${variables}

  html {
    box-sizing: border-box;
    max-width: 100%;
    scroll-behavior: smooth;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  ::selection {
    background-color: var(--steel-blue);
    color: white;
  }

  h1 {
    font-family: var(--font-mono);
  }

  label {
    padding: 0.45rem;
    font-weight: 500;
    font-size: 1.1rem;
  }
  input {
    font-size: 1.1rem;
    padding: 0.45rem 0.6rem;
    border: var(--gainsboro) 1px solid;
    border-radius: var(--border-radius);

    font-family: 'FiraCode NF', sans-serif;
  }

  body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    color: var(--gainsboro);
  }
`