import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global styles — order matters
import './styles/index.css'
import './styles/typography.css'
import './styles/animations.css'
import './styles/rtl.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)