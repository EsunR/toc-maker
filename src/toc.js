import TocObj from './tocObj.js'

export default class Toc {
  constructor(article, options = {}) {
    if (options.nullTitle === undefined) {
      options.nullTitle = ''
    }
    if (options.autoCompletion === undefined) {
      options.autoCompletion = true
    }
    if (options.anch === undefined) {
      options.anch = true
    }
    if (options.href === undefined) {
      options.href = true
    }
    if (options.deep === undefined || options.deep > 6) {
      options.deep = 6
    }
    this.options = options
    this.headers = this._preMakeHeaders(article)
    if (options.autoCompletion) {
      this._checkHeaders(this.headers)
    }
    // 创建目录容器
    let ul = document.createElement('ul')
    let sectionNumbers = [0, 0, 0, 0, 0, 0]
    let tocobj = new TocObj(ul, 1, sectionNumbers, this.options)
    // 将 headers 推入容器
    for (var i = 0; i < this.headers.length; i++) {
      tocobj.add(this.headers[i])
    }
    // 生成 TOC 元素
    this.tocEl = tocobj.el
  }
  _preMakeHeaders(article) {
    // 对header进行整理、添加锚点
    let eleArr = article.children
    let headers = []
    let ids = []
    for (let i in eleArr) {
      if (eleArr[i].tagName && /H1|H2|H3|H4|H5|H6/.test(eleArr[i].tagName)) {
        headers.push(eleArr[i])
        // 添加锚点
        if (this.options.anch === true) {
          let id = eleArr[i].innerHTML
          for (let i in ids) {
            if (id === ids[i]) {
              id = '#' + id
            }
          }
          ids.push(id)
          eleArr[i].setAttribute('id', id)
        }
      }
    }
    return headers
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
