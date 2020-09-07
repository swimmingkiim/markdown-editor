import React, { useState, useEffect } from "react";
import PropTypes, { element } from "prop-types";
import styled from "styled-components";
import {
  insertEmphasizingTag,
  insertLink,
  changeTagType,
  turnIntoTag,
} from "./utils/EditorUtils";

const Editor = ({}) => {
  const [markdownText, setMarkdownText] = useState("");

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

  const htmlToMarkdown = (htmlStr) => {
    const turndownService = new TurndownService();
    return turndownService.turndown(htmlStr);
  };

  const saveToFiles = (e) => {
    const editor = e.target.nextSibling;
    const filename = "gonggeul.md";
    const newAtag = document.createElement("a");
    newAtag.setAttribute(
      "href",
      `data:text/markdown;charset=utf-8,${encodeURIComponent(
        htmlToMarkdown(editor)
      )}`
    );
    newAtag.setAttribute("download", filename);
    newAtag.style.display = "none";
    document.body.appendChild(newAtag);
    newAtag.click();
    newAtag.remove();
  };

  return (
    <EditorContainer>
      <Title>GongGeul</Title>
      <SubTitle>Simple Markdown Editor</SubTitle>
      <Button className="desktop" type="button" onClick={(e) => saveToFiles(e)}>
        SAVE
      </Button>
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
      <ButtonContainer>
        <Button
          className="mobile"
          type="button"
          onClick={(e) => saveToFiles(e)}
        >
          SAVE
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
  @media only screen and (max-width: 768px) {
    position: sticky;
    bottom: 2.5%;
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

  @media only screen and (max-width: 768px) {
    font-size: 100%;
  }
`;

export default Editor;
