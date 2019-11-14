export default class TocObj {
  /**
   *
   * @param {Element} el 父级元素
   * @param {String} level 创建当前项header的等级
   * @param {Array} sectionNumbers 索引列表
   * @param {Object} options 用户设置项
   * @param {Number} deep 当前ul的深度
   */
  constructor(el, level, sectionNumbers, options, deep = 1) {
    this.el = el
    this.el.circular = this
    this.level = level
    this.sectionNumbers = sectionNumbers
    this.options = options
    this.deep = deep
    // 当前节点的数量
    this.num = 0
  }
  add(header) {
    var flag = this.el.tagName == 'UL' // ul节点和li节点处理header的方式不通过
    var level = parseInt(header.tagName.charAt(1))

    // 如果当前节点为 ul
    if (flag) {
      if (this.options.deep < this.deep) {
        return;
      }
      this.el.setAttribute('data-deep', this.deep)
      // 如果将要处理的 header 等级与当前的 ul 等级相匹配
      // 那就创建一个 li 将其存放
      if (level == this.level) {
        var link = document.createElement('a')
        link.href = ''
        link.innerHTML = header.innerHTML
        // 记录标题计数器
        this.sectionNumbers[level - 1]++
        for (var i = level; i < this.sectionNumbers.length; i++) {
          this.sectionNumbers[i] = 0
        }
        link.setAttribute(
          'data-index',
          this.sectionNumbers.slice(0, level).join('.')
        )
        link.setAttribute('data-level', level)
        link.href = '#' + header.id
        // 创建一个 li 元素并插入到当前 ul 中
        var li = document.createElement('li')
        li.insertBefore(link, li.firstChild)
        this.num++
        this.el.appendChild(
          new TocObj(li, level, this.sectionNumbers, this.options, this.deep).el
        )
      }
      // 如果当前 header 的等级大于当前 ul 等级
      else if (level > this.level) {
        var lastChild = this.el.lastChild
        lastChild.circular.add(header) // 让ul节点的li节点去处理header
      }
    }

    // 如果当前节点为 li
    else {
      // 没有ul子节点，就创建一个
      if (this.num == 0) {
        var ul = document.createElement('ul')
        let newObj = new TocObj(
          ul,
          level,
          this.sectionNumbers,
          this.options,
          this.deep + 1
        )
        this.el.appendChild(newObj.el)
        this.num++
        newObj.add(header)
      } else {
        var lastChild = this.el.lastChild
        lastChild.circular.add(header)
      }
    }
  }
}
