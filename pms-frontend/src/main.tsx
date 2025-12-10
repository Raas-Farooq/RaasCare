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
        toastOptions={{
          classNames: {
            success: 'bg-green-500 text-white border-0',
            error: 'bg-red-500 text-white border-0',
            warning: 'bg-yellow-500 text-white border-0',
            info: 'bg-blue-500 text-white border-0',
          },
        }}
      />
      <RouterProvider router={myRouter} />
    </AuthProvider>

  </>
)
