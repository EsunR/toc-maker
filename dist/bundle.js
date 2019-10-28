'use strict';

class TocObj {
  constructor(el, level, sectionNumbers) {
    this.el = el;
    this.el.circular = this;
    this.level = level;
    // 当前节点的数量
    this.num = 0;
    this.sectionNumbers = sectionNumbers;
  }
  add(header) {
    var flag = this.el.tagName == 'UL'; // ul节点和li节点处理header的方式不通过
    var level = parseInt(header.tagName.charAt(1));

    // 如果当前节点为 ul
    if (flag) {
      // 如果将要处理的 header 等级与当前的 ul 等级相匹配
      // 那就创建一个 li 将其存放
      if (level == this.level) {
        var link = document.createElement('a');
        link.href = '';
        link.innerHTML = header.innerHTML;
        // 记录标题计数器
        this.sectionNumbers[level - 1]++;
        for (var i = level; i < this.sectionNumbers.length; i++) {
          this.sectionNumbers[i] = 0;
        }
        link.href = "#TOC" + this.sectionNumbers.slice(0, level).join('.');

        // 创建一个 li 元素并插入到当前 ul 中
        var li = document.createElement('li');
        li.insertBefore(link, li.firstChild);
        this.num++;
        this.el.appendChild((new TocObj(li, level, this.sectionNumbers)).el);
      }
      // 如果当前 header 的等级大于当前 ul 等级
      else if (level > this.level) {
        var lastChild = this.el.lastChild;
        lastChild.circular.add(header); // 让ul节点的li节点去处理header
      }
    }

    // 如果当前节点为 li
    else {
      // 没有ul子节点，就创建一个
      if (this.num == 0) {
        var ul = document.createElement('ul');
        let newObj = new TocObj(ul, level, this.sectionNumbers);
        this.el.appendChild(newObj.el);
        this.num++;
        newObj.add(header);
      } else {
        var lastChild = this.el.lastChild;
        lastChild.circular.add(header);
      }
    }

  }
}

class Toc {
  constructor(article, options) {
    if (!options.nullTitle) {
      options.nullTitle = "";
    }
    this.options = options;
    let eleArr = article.children;
    let arr = [];
    for (let i in eleArr) {
      arr.push(eleArr[i]);
    }
    for (let i in arr) {
      if (!/H1|H2|H3|H4|H5|H6/.test(arr[i].tagName)) {
        arr.splice(i, 1);
        i--;
      }
    }
    this.headers = arr.slice(0, arr.length - 1);
    this._checkHeaders(this.headers);
    // 创建目录容器
    let ul = document.createElement("ul");
    let sectionNumbers = [0, 0, 0, 0, 0, 0];
    let tocobj = new TocObj(ul, 1, sectionNumbers);
    // 将 headers 推入容器
    for (var i = 0; i < this.headers.length; i++) {
      tocobj.add(this.headers[i]);
    }
    // 生成 html
    this.dom = tocobj.el;
  }
  _checkHeaders(headers) {
    for (var i = 0; i < headers.length; i++) {
      let index = headers[i].tagName.charAt(1);
      if (i > 0) {
        let lastIndex = headers[i - 1].tagName.charAt(1);
        if (index > lastIndex && lastIndex != index && lastIndex != index - 1) {
          let emptyHeader = document.createElement(`h${index - 1}`);
          emptyHeader.innerHTML = this.options.nullTitle;
          headers.splice(i, 0, emptyHeader);
          i--;
        }
      } else {
        if (index != 1) {
          let emptyHeader = document.createElement(`h${index - 1}`);
          emptyHeader.innerHTML = this.options.nullTitle;
          headers.splice(i, 0, emptyHeader);
          i--;
        }
      }
    }
  }
}

module.exports = Toc;
