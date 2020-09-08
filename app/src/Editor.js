import React, { useRef } from "react";
import PropTypes, { element } from "prop-types";
import styled from "styled-components";
import { checkAndChangeText } from "./utils/editorUtils";
import { openTextFile } from "./utils/markdownToHTML";
import { saveToFiles } from "./utils/htmlToMarkdown";

const Editor = ({}) => {
  const editor = useRef();

  return (
    <EditorContainer>
      <Title>GongGeul</Title>
      <SubTitle>Simple Markdown Editor</SubTitle>
      <ButtonContainer>
        <Button
          className="desktop"
          type="button"
          onClick={(e) => saveToFiles(e, editor.current)}
        >
          SAVE
        </Button>
        <Button
          className="desktop"
          type="button"
          onClick={(e) => openTextFile(e, editor.current)}
        >
          OPEN
        </Button>
      </ButtonContainer>
      <EditorDiv
        ref={editor}
        contentEditable={true}
        onKeyUp={(e) => checkAndChangeText(e)}
        suppressContentEditableWarning={true}
      >
        <h3>Things that you can use</h3>
        <ul>
          <li># : Heading 1</li>
          <li>## : Heading 2</li>
          <li>### : Heading 3</li>
          <li>* : un-ordered list</li>
          <li>1. : ordered list</li>
          <li>__boldtext__: bold</li>
          <li>_italictext_: italic</li>
          <li>~~deletedtext~~: deleted</li>
          <li>`highlight`: highlight</li>
          <li>[displaytext](url): link</li>
          <li>![title](url): image</li>
        </ul>
      </EditorDiv>
      <ButtonContainer>
        <Button
          className="mobile"
          type="button"
          onClick={(e) => saveToFiles(e, editor.current)}
        >
          SAVE
        </Button>
        <Button
          className="mobile"
          type="button"
          onClick={(e) => openTextFile(e, editor.current)}
        >
          OPEN
        </Button>
      </ButtonContainer>
    </EditorContainer>
  );
};

const EditorContainer = styled.main`
  width: 70%;
  min-height: 100vh;
  margin: auto;
  padding: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  @media only screen and (max-width: 768px) {
    padding: 1%;
    position: relative;
    padding-top: 7.5%;
  }
`;

const Title = styled.h1`
  color: #000000;
  padding: 0.5%;
  @media only screen and (max-width: 768px) {
    padding: 0.25em;
  }
`;

const SubTitle = styled.h3`
  color: grey;
  padding: 2%;
  @media only screen and (max-width: 768px) {
    padding: 1em;
    margin-bottom: 1em;
    font-size: 100%;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  padding: 0 30%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  button + button {
    margin-left: 5%;
  }
  @media only screen and (max-width: 768px) {
    position: sticky;
    bottom: 2.5%;
    flex-direction: column;
    align-items: flex-end;
    padding: 0 0 0 60%;

    button + button {
      margin: 5% 0 0 0;
    }
  }
`;

const Button = styled.button`
  border: none;
  border-radius: 0.25em;
  padding: 1em;
  letter-spacing: 0.25em;
  text-align: center;
  float: right;
  background-color: #71c3b3;
  color: #ffffff;
  &.mobile {
    display: none;
  }
  &.desktop {
    display: inline-block;
  }
  @media only screen and (max-width: 768px) {
    &.mobile {
      display: inline-block;
      transform: translateX(50%);
    }
    &.desktop {
      display: none;
    }
  }
`;

const EditorDiv = styled.div`
  width: 100%;
  height: 80%;
  flex: 1;
  padding: 5%;
  font-size: 150%;
  background-color: white;
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  ol,
  ul {
    margin-left: 5%;
  }

  & mark {
    background-color: lightgrey;
    border-radius: 0.25em;
    padding: 0.1em;
  }

  &:focus {
    outline: none;
  }

  & > * {
    width: 100%;
    line-height: 1.5em;
  }

  img {
    width: 100%;
  }

  @media only screen and (max-width: 768px) {
    font-size: 100%;
    ol,
    ul {
      margin-left: 10%;
    }
  }
`;

export default Editor;
