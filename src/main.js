import "./assets/main.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "@popperjs/core/dist/umd/popper.min.js";
import "bootstrap/dist/js/bootstrap.min.js";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);

app.mount("#app");
