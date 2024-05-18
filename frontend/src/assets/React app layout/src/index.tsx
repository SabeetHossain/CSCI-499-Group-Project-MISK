import React from "react";
import ReactDOMClient from "react-dom/client";
// import { Element } from "./screens/Element";
import {Element} from "../../../pages/Home_Page/components/Element";

const app = document.getElementById("app")!;
const root = ReactDOMClient.createRoot(app);
root.render(<Element />);
