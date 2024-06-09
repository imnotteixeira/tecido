// This is the entrypoint for the frontend code.
// The main goal is to *hydrate* whatever the server already sent, and make the page dynamic
// Keep in mind that the server renders the <App /> component, so this client code should also start the tree using it
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app';
import { containerId } from '../shared/constants';
import { PageContext } from '../shared';

declare global {
    interface Window { __APP_CONTEXT__: PageContext }
}

const context = window.__APP_CONTEXT__

ReactDOM.hydrateRoot(
    document.getElementById(containerId) as HTMLElement,
    <React.StrictMode>
      <App {...context}/>
    </React.StrictMode>
  )