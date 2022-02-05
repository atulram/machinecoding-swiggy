"use strict";
import utility from "./js/utility/utility.js";
import Home from "./js/views/home.js";
(() => {
  utility.addEventListener("DOMContentLoaded", document, () => {
    new Home();
  });
})();
