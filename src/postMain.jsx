import React from 'react'
import { createRoot } from 'react-dom/client'
import { Nav, Footer } from './App.jsx'
import { PostPage } from './blogPages.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="top"><Nav home={false} /></div>
    <main><PostPage /></main>
    <Footer />
  </React.StrictMode>
)
