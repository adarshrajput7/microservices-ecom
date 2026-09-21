// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // ⭐ IMPORTANT: Add CSS
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import AuthCheck from "./AuthCheck.jsx";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store} >
      <BrowserRouter>
        <AuthCheck />
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
      </BrowserRouter>
    </Provider>,
  {/* </StrictMode>, */}
)
