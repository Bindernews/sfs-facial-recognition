import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

const document = document;
document.title = 'FaceRekt';
const root = document.body.appendChild(document.createElement('div'));
root.id = 'root';

// Now we can render our application into it
render(<App />, document.getElementById('root'));
