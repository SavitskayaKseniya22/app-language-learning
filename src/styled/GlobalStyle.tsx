import { createGlobalStyle } from "styled-components";
import titles from "./Titles";
import root from "./Root";
import back from "../assets/images/jpeg/vecteezy_beautiful-abstract-background-with-gradient-rainbow-blob_13047954.jpg";

const GlobalStyle = createGlobalStyle`
  ${root};
  ${titles};
  
  html {
    scroll-behavior: smooth;
   
    position:relative;

    

    &:after{
      content:" ";
      position:fixed;
      top:0;
      left:0;
      width:100vw;
      height:100vh;
       background-image:url(${back});
    background-position:center;
    background-repeat:no-repeat;
    background-size:cover;
    z-index:1;
    opacity:0.1;
    }
    
  }

  body {
    font-family: "Noto Sans", sans-serif;
    position:relative;
    z-index:2;
  }

  * {
    box-sizing: border-box;
  }

  p,
  ul,
  body {
    margin: 0;
  }

  input {
    padding: 0;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  button {
    border: none;
    cursor: pointer;
    background-color: transparent;
    font-family: inherit;
    font-size:inherit;
    line-height: 1;
    color: inherit;

    &:disabled {
        opacity: 0.3;
        pointer-events:none;
    }
  }

  a {
    text-decoration: none;
    font-family: inherit;
    color: inherit;
    font-size: inherit;
    line-height: 1;
  }

  i {
    font-size: inherit;
    color: inherit;
  }

`;

export default GlobalStyle;
