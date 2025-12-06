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
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 9999,
          },
        }}
        containerStyle={{
          zIndex: 9999,
        }}
        // Force re-render on mobile
        reverseOrder={false}
      />
      <RouterProvider router={myRouter} />
    </AuthProvider>

  </>
)
