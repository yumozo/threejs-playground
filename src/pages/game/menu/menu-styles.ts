import { styled } from 'styled-components'

const OptionSelect = styled.form`
  fieldset {
    padding: 0;
    margin: 0;
    border: none;
  }

  label {
    font-size: 0.9rem;
  }

  .selection {
    margin-bottom: 0.15rem;
  }
`

const ButtonList = styled.ul`
  padding: 0;
  margin: 0;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  button {
    opacity: 90%;

    width: 100%;
    margin-bottom: 0.25rem;
    padding: 0.25rem 0.5rem;

    font-family: var(--font-mono);
    text-align: center;
    color: white;

    background: var(--slate-gray);
    border: 1px solid var(--gainsboro);
    border-radius: 8px;
    font-weight: 600;

    &:hover {
      cursor: pointer;
      background: var(--steel-blue);
      border-color: var(--baby-blue);
    }
  }
`

const StyledMenu = styled.div<{ position?: number }>`
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  position: absolute;
  /* bottom: ${(props) => (props.position ? props.position : '200px')}; */
  top: 0;
  /* right: 20px; */
  right: 0;
  height: 100vh;

  border-left: 1px solid #c0c0c088;
  background: #31313188;
  /* border-radius: 10px; */ // set it if detached

  font-family: var(--font-mono);
  color: white;
`

const SectionHeading = styled.h3`
  display: block;
  padding-left: 0.65rem;
  margin: 0 0 0;

  background: #0008;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--silver);

  font-family: var(--font-mono);
`

const DragHandle = styled.div`
  height: 16px;
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: black;
  color: var(--sky-blue);
  font-size: 0.9;
`

export { StyledMenu, SectionHeading, ButtonList, OptionSelect, DragHandle }
