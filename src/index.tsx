/* @refresh reload */
import { render } from "solid-js/web";
import { hashIntegration, Router } from "@solidjs/router";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-creative";
import "./index.css";
import App from "./App";

render(
  () => (
    <Router source={hashIntegration()}>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
