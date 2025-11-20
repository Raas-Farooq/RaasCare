import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/appContext.tsx';
import { myRouter } from './Components/AppRoutesFrontend/router.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <RouterProvider router={myRouter} />
      </AuthProvider>
  </StrictMode>
)
