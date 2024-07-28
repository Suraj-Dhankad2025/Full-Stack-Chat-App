import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import {RecoilRoot} from 'recoil'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <CssBaseline />
      {/* <div onContextMenu={(e)=> e.preventDefault()}> */}
       <div>
      <RecoilRoot>
        <App />
      </RecoilRoot>
      </div>
    </HelmetProvider>
  </React.StrictMode>,
)
