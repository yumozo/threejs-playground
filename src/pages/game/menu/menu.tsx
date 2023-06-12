import { useState } from 'react'
import { StyledMenu, SectionHeading, ButtonList, OptionSelect, DragHandle } from './menu-styles'
import Section from './section'

export default function Menu() {
  const [folded, setFolded] = useState(false)

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
          <SectionHeading>Post-Processing</SectionHeading>
          <Section heading="render pass">
            <OptionSelect>
              <div>
                <fieldset>
                  {/* <legend>Render Pass</legend> */}
                  <div className="selection">
                    <input type="checkbox" name="webfeature" value="html" id="html" />
                    <label htmlFor="html">Dithering</label>
                  </div>
                  <div className="selection">
                    <input type="checkbox" name="webfeature" value="css" id="css" />
                    <label htmlFor="css">PixelatedPass</label>
                  </div>
                </fieldset>
              </div>
            </OptionSelect>
          </Section>
        </>
      )}
      <DragHandle onClick={() => setFolded(!folded)}>
        {folded ? 'Open' : 'Fold'}
      </DragHandle>
    </StyledMenu>
  )
}
