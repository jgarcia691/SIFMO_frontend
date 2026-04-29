import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@fontsource-variable/material-symbols-outlined";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/work-sans";
import "@fontsource-variable/inter";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
