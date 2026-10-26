import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './apple-motion.css'
import { App } from './App'

const rootElement = document.querySelector<HTMLDivElement>('#app')
if (!rootElement) throw new Error('Missing #app root element')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
