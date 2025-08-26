// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// import { store } from './redux/store';
// import { Provider } from 'react-redux';
// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//   //   <App />
//   // </StrictMode>,
//    <Provider store={store}>
//     <App />
//   </Provider>
// )
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
    <Toaster position='top-right'/>
      <App />
    </BrowserRouter>
  </Provider>
)
  