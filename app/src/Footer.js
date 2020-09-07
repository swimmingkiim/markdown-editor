import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterTContainer>
      <Explaination>Made by swimmingkiim</Explaination>
      <GithubLink href="https://github.com/swimmingkiim/markdown-editor">
        Github code for this editor
      </GithubLink>
    </FooterTContainer>
  );
};

const FooterTContainer = styled.footer`
  width: 100%;
  height: 10rem;
  margin-top: 5%;
  background-color: #ebebeb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Explaination = styled.p`
  color: #788487;
  font-size: 120%;
  font-weight: 700;
  margin-bottom: 1%;
`;

const GithubLink = styled.a`
  color: #788487;
  font-size: 120%;
  font-weight: 700;
  text-decoration: none;
`;

export default Footer;
