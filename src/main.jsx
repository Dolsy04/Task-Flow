import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './supabase/authContext.jsx';
import { Theme } from './components/theme.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Theme>
          <App />
        </Theme>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
