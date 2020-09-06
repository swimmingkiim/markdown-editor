import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Editor from "./Editor";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Editor />
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Nanum Gothic', sans-serif;
  }
  html, body, #root {
    width: 100%;
    height: 100%;
  }
`;

export default App;
