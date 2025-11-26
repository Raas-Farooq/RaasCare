import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/appContext.tsx';
import { myRouter } from './Components/AppRoutesFrontend/router.tsx';
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')!).render(
  <>
    <Toaster
      position="top-center"
      toastOptions={{ duration: 3000 }}
    />
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={myRouter} />
      </AuthProvider>
    </StrictMode>
  </>
)
