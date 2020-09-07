import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Editor from "./Editor";
import Footer from "./Footer";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Editor />
      <Footer />
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
    min-height: 100%;
  }
`;

export default App;
