import Toc from "../src/index.js";

window.onload = function () {
  const options = {
    deep: 3,
    scrollContainer: document.getElementById("post"),
  };
  const toc = new Toc(document.querySelector("#post"), options);
  document.querySelector("#toc").append(toc.tocEl);
};
