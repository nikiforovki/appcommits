import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import StoreProvider from './app/providers/StoreProvider';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error(
    'Не удалось найти элемент с id "root". Проверьте, что элемент существует в HTML.',
  );
  throw new Error('Не удалось найти элемент с id "root".');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);
