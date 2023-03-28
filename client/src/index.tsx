import App from './App';
import ReactModal from 'react-modal';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
ReactModal.setAppElement(rootElement);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
