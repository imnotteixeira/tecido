// Here, we export what will be sent by the server as the initial HTML of the page
// In truth, this is only the body part
// Notice it uses the exact same component the frontend app is using.

import { renderToString } from "react-dom/server";
import React from "react"
import App from "../client/components/app";
import { PageContext } from "./pages";


export default (options: PageContext) => renderToString(<App {...options}  />);