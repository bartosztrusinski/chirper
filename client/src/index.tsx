import App from './App';
import ReactModal from 'react-modal';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
const queryClient = new QueryClient();
ReactModal.setAppElement(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools
        initialIsOpen={false}
        position='bottom-right'
        toggleButtonProps={{ style: { bottom: '60px', opacity: '0.7' } }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
