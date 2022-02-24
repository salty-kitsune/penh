import React from 'react';
import ReactDOM from 'react-dom';
import { nanoid } from 'nanoid';
import { ThemeProvider, extendTheme } from '@chakra-ui/react';
import App from './App';

const wrapper = document.createElement('div');
wrapper.id = nanoid();
wrapper.tabIndex = -1;
wrapper.classList.add('salty-utility-ext');
wrapper.style.cssText = `
    position: absolute;
    font-size: 16px;
`;

document.body.append(wrapper);
const theme = extendTheme({
  fontSizes: {
    xs: '0.75em',
    sm: '0.875em',
    md: '1em',
    lg: '1.125em',
    xl: '1.25em',
    '2xl': '1.5em',
    '3xl': '1.875em',
    '4xl': '2.25em',
    '5xl': '3em',
    '6xl': '3.75em',
    '7xl': '4.5em',
    '8xl': '6em',
    '9xl': '8em',
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  wrapper
);
