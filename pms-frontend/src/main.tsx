// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/appContext.tsx';
import { myRouter } from './Components/AppRoutesFrontend/router.tsx';
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <>
    <AuthProvider>
      <Toaster
        position="top-center"
        theme="light"
      />
      <RouterProvider router={myRouter} />
    </AuthProvider>

  </>
)
