//import react into the bundle
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

const basename = process.env.BASENAME || "";

//render your react application
const root = createRoot(document.querySelector("#app"));
root.render(
    <Router basename={basename}>
        <Layout />
    </Router>
);
