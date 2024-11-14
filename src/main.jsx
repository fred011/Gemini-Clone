
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProviver from './context/context.jsx'

createRoot(document.getElementById('root')).render(
  <ContextProviver>
    <App />
  </ContextProviver>,
)
