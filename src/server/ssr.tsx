// Here, we export what will be sent by the server as the initial HTML of the page
// In truth, this is only the body part
// Notice it uses the exact same component the frontend app is using.

import App from "../client/components/app";
import { PageContext } from "./pages";
import React from 'react'
import ReactDOMServer from 'react-dom/server'

export type SSRContentBuilder = (options: PageContext) => {head?: string, html?: string}

export const ssr: SSRContentBuilder = (options: PageContext) => {
  
    const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App {...options} />
    </React.StrictMode>
  )

  return { html }
}
