import TocObj from './tocObj.js';

export default class Toc {
  constructor(article, options) {
    if (!options.nullTitle) {
      options.nullTitle = ""
    }
    this.options = options
    let eleArr = article.children
    let arr = []
    for (let i in eleArr) {
      arr.push(eleArr[i])
    }
    for (let i in arr) {
      if (!/H1|H2|H3|H4|H5|H6/.test(arr[i].tagName)) {
        arr.splice(i, 1)
        i--
      }
    }
    this.headers = arr.slice(0, arr.length - 1)
    this._checkHeaders(this.headers)
    // 创建目录容器
    let ul = document.createElement("ul")
    let sectionNumbers = [0, 0, 0, 0, 0, 0]
    let tocobj = new TocObj(ul, 1, sectionNumbers)
    // 将 headers 推入容器
    for (var i = 0; i < this.headers.length; i++) {
      tocobj.add(this.headers[i]);
    }
    // 生成 html
    this.dom = tocobj.el
  }
  _checkHeaders(headers) {
    for (var i = 0; i < headers.length; i++) {
      let index = headers[i].tagName.charAt(1)
      if (i > 0) {
        let lastIndex = headers[i - 1].tagName.charAt(1)
        if (index > lastIndex && lastIndex != index && lastIndex != index - 1) {
          let emptyHeader = document.createElement(`h${index - 1}`)
          emptyHeader.innerHTML = this.options.nullTitle
          headers.splice(i, 0, emptyHeader)
          i--
        }
      } else {
        if (index != 1) {
          let emptyHeader = document.createElement(`h${index - 1}`)
          emptyHeader.innerHTML = this.options.nullTitle
          headers.splice(i, 0, emptyHeader)
          i--
        }
      }
    }
  }
}