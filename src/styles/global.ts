import { createGlobalStyle } from 'styled-components'
import { variables } from '@styles/variables'

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

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 10px 0;
    font-weight: 600;
    line-height: 1.1;
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
    margin: 0;
    width: 100%;
    min-height: 100%;
    font-family: var(--font-sans);
    background: black;
    color: var(--gainsboro);
    font-size: 1em;
    line-height: 1.3;
  }

  main{
    margin: 0 auto;
    width: 100%;
    max-width: 1600px;
    min-height: 100vh;
    padding: 200px 150px;
    @media (max-width: 1080px) {
      padding: 200px 100px;
    }
    @media (max-width: 768px) {
      padding: 150px 50px;
    }
    @media (max-width: 480px) {
      padding: 125px 25px;
    }
    &.fillHeight {
      padding: 0 150px;
      @media (max-width: 1080px) {
      padding: 0 100px;
      }
      @media (max-width: 768px) {
        padding: 0 50px;
      }
      @media (max-width: 480px) {
        padding: 0 25px;
      }
    }
  }

  section {
    margin: 0 auto;
    padding: 100px 0;
    max-width: 1000px;

    @media (max-width: 768px) {
      padding: 80px 0;
    }
    @media (max-width: 480px) {
      padding: 60px 0;
    }
  }

  button {
    cursor: pointer;
    border: 0;
    border-radius: 0;
  }

  a {
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: var(--coral);
    /* position: relative; */
    transition: var(--transition);

    &:hover,
    &:focus {
      color: var(--light-salmon);
    }
  }
  
`
