/**
 * @module app/main
 * @summary Application entry point
 * @type application-bootstrap
 * @category core
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '@/assets/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
