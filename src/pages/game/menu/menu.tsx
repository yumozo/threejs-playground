import React, { useContext, useEffect, useState } from 'react'

import { StyledMenu, SectionHeading, ButtonList, OptionSelect, FoldButton } from './menu-styles'
import Section from './section'
import { PassManagerContext } from '@context/pass-context'

/**
 * @todo Create an emitter for PassManager to check if composer provided.
 */
export default function Menu() {
  const [folded, setFolded] = useState(false)
  const [passes, setPasses] = useState<{ bloom: boolean; pixel: boolean }>({
    bloom: false,
    pixel: false
  })
  const { passManager } = useContext(PassManagerContext)

  useEffect(() => {
    if (!passManager) return

    const bloomValue = passManager.isPassOn('bloom')
    const pixelValue = passManager.isPassOn('pixel')
    setPasses({ pixel: pixelValue, bloom: bloomValue })
  }, [passManager])

  function handlePassChange(e: React.ChangeEvent<HTMLInputElement>) {
    // e.preventDefault()
    if (!passManager) return

    const bloomValue = passManager.isPassOn('bloom')
    const pixelValue = passManager.isPassOn('pixel')
    setPasses({ pixel: pixelValue, bloom: bloomValue })

    const value = e.target.checked
    if (value) {
      passManager.turnOnPass(e.target.name)
    } else if (!value) {
      passManager.turnOffPass(e.target.name)
    }
  }

  return (
    <StyledMenu>
      {folded ? null : (
        <>
          <SectionHeading>Menu</SectionHeading>
          <Section heading="world">
            <ButtonList>
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
            </ButtonList>
          </Section>
          {/* <SectionHeading>Post-Processing</SectionHeading> */}
          <Section heading="render pass">
            <OptionSelect>
              <div>
                <fieldset>
                  {/* <legend>Render Pass</legend> */}
                  <div className="selection">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        handlePassChange(e)
                      }}
                      checked={passes.bloom}
                      name="bloom"
                      value="bloom"
                      id="bloom"
                    />
                    <label htmlFor="html">Bloom filter</label>
                  </div>
                  <div className="selection">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        handlePassChange(e)
                      }}
                      checked={passes.pixel}
                      name="pixel"
                      value="pixel"
                      id="pixel"
                    />
                    <label htmlFor="css">Pixelated Pass</label>
                  </div>
                </fieldset>
              </div>
            </OptionSelect>
          </Section>
        </>
      )}
      <FoldButton onClick={() => setFolded(!folded)}>{folded ? 'Open' : 'Fold'}</FoldButton>
    </StyledMenu>
  )
}
