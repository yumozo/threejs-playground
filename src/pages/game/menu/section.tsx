import { useState } from 'react'
import { styled } from 'styled-components'

const SectionHeading = styled.h4<{ folded: boolean }>`
  display: flex;
  -moz-box-align: center;
  align-items: center;
  position: relative;
  margin: 10px 0px 16px;
  width: 100%;
  white-space: nowrap;

  font-family: var(--font-mono);
  font-weight: 400;
  color: white;

  cursor: pointer;

  &:after {
    content: '';
    display: block;
    position: relative;
    top: 5px;
    width: 100%;
    height: 1px;
    margin-left: 6px;
    background-color: var(--gainsboro);
    background-color: ${(props) => (props.folded ? 'var(--gainsboro)' : 'var(--sky-blue)')};
  }

  &:before {
    content: '${(props) => (props.folded ? '▸' : '▾')}';
    display: block;
    position: relative;
    margin-right: 8px;
    margin-left: 2px;

    color: ${(props) => (props.folded ? 'inherit' : 'var(--sky-blue)')};
  }
`

const StyledSection = styled.section`
  width: 200px;
  padding: 0.25rem 0.5rem;
  margin-bottom: 1rem;
`

export default function Section({ children, heading }) {
  const [folded, setFolded] = useState(false)

  return (
    <StyledSection>
      <SectionHeading onClick={() => setFolded(!folded)} folded={folded}>
        {heading}
      </SectionHeading>
      {folded ? null : children}
    </StyledSection>
  )
}
