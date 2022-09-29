import { css } from "lit";

export const markdownStyles = css`
  :host {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0;
    padding: 0 4px;
    width: 100%;
    height: 40px;
    list-style-type: none;
    border: 1px solid var(--secondary-color);
    border-radius: var(--radius);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: var(--secondary-color);
  }

  li {
    padding: 0.5rem;
    margin: 0;
    color: black;
    cursor: pointer;
    border-radius: var(--radius);
    max-height: 35px;
    max-width: 38px;
    display: flex;
  }
  li:hover {
    background-color: var(--secondary-color-hover);
  }

  textarea {
    border: 1px solid var(--secondary-color);
    border-radius: 0px;
    border-bottom-left-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
    min-height: 30vh;
    padding: 0.5rem;
    max-width: 100%;
    min-width: 100%;
    margin: 0;
    outline: none;
  }
`;
