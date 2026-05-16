import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/main.scss';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing #root element in index.html');
}

hydrateRoot(
  root,
  <StrictMode>
    <App />
  </StrictMode>,
);
