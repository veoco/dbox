import React from 'react'
import ReactDOM from 'react-dom/client'
import { SWRConfig } from 'swr'

import App from './app'
import './index.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>,
)
