import { css } from "lit";
const formStyles = css `
  div {
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 1rem auto;
  }

  div input {
    border: 1px solid rgb(214, 214, 214);
    border-radius: 4px;
    height: 40px;
    padding: 1rem;
  }

  div textarea {
    border: 1px solid rgb(214, 214, 214);
    border-radius: 4px;
    height: 200px;
    padding: 1rem;
  }

  input[type="file"] {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
  }

  .file-label {
    background-color: white;
    border: 1px solid rgb(214, 214, 214);
    border-radius: 8px;
    width: 80%;
    text-align: center;
    padding: 0.5rem 1rem;
    margin: 0 auto;
    cursor: pointer;
  }
`;
export default formStyles;
//# sourceMappingURL=form.js.map