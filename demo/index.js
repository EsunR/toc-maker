import Toc from "../src/index.js";
window.onload = function() {
  var toc = new Toc(document.querySelector("#post"));
  document.querySelector("#toc").append(toc.tocEl);
};
