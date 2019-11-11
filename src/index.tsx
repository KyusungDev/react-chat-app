import React from 'react';
import ReactDOM from 'react-dom';
import reset from 'styled-reset';
import { createGlobalStyle } from 'styled-components';
import 'antd/dist/antd.css';
import App from './App';

const GlobalStyle = createGlobalStyle`${reset}`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root')
);
