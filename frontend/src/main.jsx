import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CardComponent from '../components/testimonial';

const cards = [
  { title: 'Card 1', image: '/placeholder-300x400.png' },
  { title: 'Card 2', image: '/placeholder-300x400.png' },
  { title: 'Card 3', image: '/placeholder-300x400.png' },
  { title: 'Card 4', image: '/placeholder-300x400.png' },
];

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <App cards={cards} />
      </BrowserRouter>
    </StrictMode>,
  );
} else {
  console.error('Root element not found');
}