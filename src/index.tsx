// index.tsx or index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!); // Change to createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
