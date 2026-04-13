import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/index.js'

// Apply saved language direction on load
const savedLang = localStorage.getItem('sanad_lang') || 'ar'
document.documentElement.lang = savedLang
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
