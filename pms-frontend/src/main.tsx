import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css';
import './index.css';
import App from './App.tsx'
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/appContext.tsx';
import { myRouter } from './Components/AppRoutesFrontend/router.tsx';

console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <RouterProvider router={myRouter} />
      </AuthProvider>
  </StrictMode>
)
