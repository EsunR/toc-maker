import Toc from '../src/index.js'
window.onload = function() {
  var options = {
    autoCompletion: false,
    deep: 3
  }
  var toc = new Toc(document.querySelector('#post'), options)
  document.querySelector('#toc').append(toc.tocEl)
}
