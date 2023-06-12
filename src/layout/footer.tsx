import { useState, useEffect } from "react"
import styled from "styled-components"

interface Props {
  position: string
}
const Footer_s = styled.footer<Props>`
  /* position: relative; */
  position: ${(props) => props.position};
  bottom: 0;
  left: 0;
  width: calc(100vw - 2 * 1em);
  margin: 1em;
  padding-top: 1em;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  z-index: 0;
  /* width: calc(100vh - 2*1em); */
`

export default function Footer() {
  const [footerStyle, setFooterStyle] = useState("relative")
  const [doneOnce, setDoneOnce] = useState(false)
  // fcn debugger
  const [doneTwice, setDoneTwice] = useState(false)

  useEffect(() => {
    // DEBUG
    console.log(
      "Scroll h is larger than inner h: " +
        (document.documentElement.scrollHeight > window.innerHeight)
    )
    //

    if (document.documentElement.scrollHeight > window.innerHeight) {
      setFooterStyle("fixed")
    } else if (doneOnce) {
      setDoneOnce(true)
      // If render is done once it MAY be absolute
      setFooterStyle("relative")
    }
  })

  return <Footer_s position={"relative"}>_name | _2023</Footer_s>
}
