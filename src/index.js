import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

document.title = 'FaceRekt';
const root = document.body.appendChild(document.createElement('div'));
root.id = 'root';

// Wrap the main application in a theme
const Application = () => (
  // <MuiThemeProvider>
  <App />
  // </MuiThemeProvider>
);

// Now we can render our application into it
render(<Application />, document.getElementById('root'));
