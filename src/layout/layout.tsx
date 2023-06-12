import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Head from './head'
import Footer from './footer'
// import { GlobalStyle } from '@styles/global'

export default function Layout({
  navigate,
  children
}: {
  navigate?: Function
  children: React.ReactNode
}) {
  // const p5Ref = useRef(null);
  // useEffect(() => {
  //   let p5_1 = new p5(sketch, p5Ref.current)
  // }, [p5Ref])

  return (
    <>
      {/* <Head navigate={navigate} /> */}
      <main className="fillHeight">
        {/* <ThemeProvider theme={theme}> */}
        {/* <GlobalStyle/> */}
        {children}
        {/* </ThemeProvider> */}
      </main>
      {/* <Footer /> */}
    </>
  )
}
