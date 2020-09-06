import React, { useState, useEffect } from "react";
import PropTypes, { element } from "prop-types";
import styled from "styled-components";
import {
  insertEmphasizingTag,
  insertLink,
  changeTagType,
} from "./utils/EditorUtils";

const Editor = ({}) => {
  const checkAndChangeText = (e) => {
    const currentElement = window.getSelection().focusNode;
    if (e.keyCode === 48) {
      const addressString = currentElement.textContent.match(
        /(\[.+\])(\(.+\))/g
      );
      if (addressString) insertLink(currentElement, addressString[0]);
    }
    if (e.keyCode === 189) {
      if (currentElement.textContent.indexOf("__") >= 0) {
        insertEmphasizingTag(currentElement, "__");
      } else {
        insertEmphasizingTag(currentElement, "_");
      }
    } else if (e.keyCode === 32) {
      changeTagType(currentElement, e.target);
    } else if (e.keyCode === 192) {
      if (currentElement.textContent.indexOf("~~") >= 0) {
        insertEmphasizingTag(currentElement, "~~");
      } else {
        insertEmphasizingTag(currentElement, "`");
      }
    }
  };

  return (
    <EditorContainer>
      <Title>GongGeul</Title>
      <SubTitle>Simple Markdown Editor</SubTitle>
      <EditorDiv
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
        </ul>
      </EditorDiv>
    </EditorContainer>
  );
};

const EditorContainer = styled.main`
  width: 70%;
  height: 100%;
  margin: auto;
  padding: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Title = styled.h1`
  color: #000000;
`;

const SubTitle = styled.h3`
  color: grey;
`;

const EditorDiv = styled.div`
  width: 100%;
  height: 80%;
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
`;

export default Editor;
