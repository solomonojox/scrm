import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ContextProvider from './Context/ContextProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Store/store.ts'
import App from './App.jsx'
// JavaScript (e.g., main.js)
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from './Context/Auth/AuthProvider.tsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ContextProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
