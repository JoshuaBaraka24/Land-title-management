import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './authContext';
import { Buffer } from 'buffer';
 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.process = window.process || {
    env: { NODE_ENV: process.env.NODE_ENV || 'development' },
    version: '',
    nextTick: require('process/browser').nextTick
  };
}