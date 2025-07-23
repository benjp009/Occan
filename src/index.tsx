import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'react-loading-skeleton/dist/skeleton.css';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';

const container = document.getElementById('root') as HTMLElement;

const initialData = (window as any).__INITIAL_DATA__;

const AppTree = (
  <React.StrictMode>
    <HelmetProvider>
      <App initialData={initialData} />
    </HelmetProvider>
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, AppTree);
} else {
  const root = ReactDOM.createRoot(container);
  root.render(AppTree);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
