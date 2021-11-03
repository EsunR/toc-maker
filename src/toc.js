import TocObj from "./tocObj.js";
import { EventHub, scrollToTarget } from "./utils.js";
import { UPDATE_ACTIVE_HEADING_EVENT, SCROLL_TIME } from "./constance.js";

export default class Toc {
  constructor(article, options = {}) {
    // 私有属性
    this._scrollingTarget = null; // 当前正在滚动到的目标位置
    this._scrollingTargetCleanTimer = null;
    this._eventHub = new EventHub();

    // 初始化配置项
    if (options.nullTitle === undefined) {
      options.nullTitle = "";
    }
    if (options.autoCompletion === undefined) {
      options.autoCompletion = true;
    }
    if (options.hashMode === undefined) {
      options.hashMode = true;
    }
    if (options.deep === undefined || options.deep > 6 || options.deep < 1) {
      options.deep = 6;
    }
    if (options.smoothScroll === undefined) {
      options.smoothScroll = true;
    }
    if (options.scrollContainer === undefined) {
      options.scrollContainer = window;
    }
    if (options.tocActiveClass === undefined) {
      options.tocActiveClass = "toc-active";
    }
    this.options = options;

    // 初始化文章锚点
    this.headings = this._preMakeHeadings(article);
    if (options.autoCompletion) {
      this._checkHeadings(this.headings);
    }

    // 创建目录容器
    const ul = document.createElement("ul");
    const tocObj = new TocObj(ul, this);

    // 将 headings 推入容器
    for (let i = 0; i < this.headings.length; i++) {
      tocObj.add(this.headings[i]);
    }

    // 添加事件监听
    this._eventHub.addEventListener(
      UPDATE_ACTIVE_HEADING_EVENT,
      this._updateActiveHeading.bind(this)
    );
    if (this.options.hashMode) {
      this._eventHub.addEventListener(
        UPDATE_ACTIVE_HEADING_EVENT,
        this._changeUrlHashByActiveHeading.bind(this)
      );
    }

    // this._eventHub.publish(UPDATE_ACTIVE_HEADING_EVENT, this.headings[0]);

    // 跳转到目标位置
    if (location.hash && options.hashMode) {
      this._jumpToHashTarget();
    }

    // 开始监听滚动事件
    this._startWatchScroll();

    // 生成 TOC 元素
    this.tocEl = tocObj.el;
  }

  /**
   * 对 Heading 标签进行整理，并为其添加锚点
   * @param {HTMLElement} article
   * @returns
   */
  _preMakeHeadings(article) {
    let eleArr = article.children;
    let headings = [];
    let ids = [];
    for (let i = 0; i < eleArr.length; i++) {
      const currentEl = eleArr[i];
      // 根据 deep 来提取有效的 Heading
      const validHeadingLevel = [];
      for (let i = 1; i <= this.options.deep; i++) {
        validHeadingLevel.push(`H${i}`);
      }
      if (
        currentEl.tagName &&
        new RegExp(validHeadingLevel.join("|")).test(currentEl.tagName)
      ) {
        headings.push(currentEl);
        // 添加锚点
        let id = currentEl.innerText;
        let repeatCount = 0;
        // 防止 id 重复
        while (ids.indexOf(id) !== -1) {
          repeatCount++;
          id = `${currentEl.innerText}#${repeatCount}`;
        }
        ids.push(id);
        currentEl.id = id;
      }
    }
    return headings;
  }

  /**
   * 对标题的层级进行补全，防止目录解构错位
   * @param {Array<Element>} headings
   */
  _checkHeadings(headings) {
    for (let i = 0; i < headings.length; i++) {
      const headingLevel = Number(headings[i].tagName.charAt(1));
      if (i > 0) {
        const lastHeadingLevel = Number(headings[i - 1].tagName.charAt(1));
        // 如果当前的 heading 等级大于且不紧邻上一个 heading 的等级，就说明发生标题错位，要对其补一个空标题
        if (headingLevel > lastHeadingLevel + 1) {
          const emptyHeading = document.createElement(`h${headingLevel - 1}`);
          emptyHeading.innerHTML = this.options.nullTitle;
          emptyHeading.isEmpty = true;
          headings.splice(i, 0, emptyHeading);
          i--;
        }
      }
      // 如果开头的标题不是一级标题，向前队列前插入空标题
      else if (headingLevel !== 1) {
        const emptyHeading = document.createElement(`h${headingLevel - 1}`);
        emptyHeading.innerHTML = this.options.nullTitle;
        emptyHeading.isEmpty = true;
        headings.splice(i, 0, emptyHeading);
        i--;
      }
    }
  }

  /**
   * 跳转到 url hash 中的目标位置
   */
  _jumpToHashTarget() {
    const hash = location.hash.slice(1, location.hash.length);
    const targetHeading = this.headings.find(
      (heading) => heading.id === decodeURI(hash)
    );
    if (targetHeading) {
      // 记录当前正在跳转的目标元素
      this._scrollingTarget = targetHeading;
      if (this._scrollingTargetCleanTimer) {
        clearTimeout(this._scrollingTargetCleanTimer);
      }
      this._scrollingTargetCleanTimer = setTimeout(() => {
        this._scrollingTarget = null;
      }, SCROLL_TIME);
      // 跳转到目标位置
      scrollToTarget(targetHeading.id, this.options);
      // 更新 activeHeading
      this._eventHub.publish(UPDATE_ACTIVE_HEADING_EVENT, targetHeading);
    }
  }

  /**
   * 监听滚动事件
   */
  _startWatchScroll() {
    const /**@type {HTMLElement} */ scrollContainer =
        this.options.scrollContainer;
    // 监听滚动到哪个标题了
    scrollContainer.addEventListener("scroll", () => {
      const currentScrollTop = scrollContainer.scrollTop;
      // 从后到前遍历 heading，查找当前滚动条在那个 heading 下
      for (let i = this.headings.length - 1; i >= 0; i--) {
        const currentHeading = this.headings[i];
        if (
          !currentHeading.isEmpty &&
          currentHeading.offsetTop <= currentScrollTop
        ) {
          // 发布更新 activeHeading 的事件
          if (
            !this.activeHeading ||
            this.activeHeading.id !== currentHeading.id
          ) {
            this._eventHub.publish(UPDATE_ACTIVE_HEADING_EVENT, currentHeading);
          }
          // 找到最近的 heading 后就要跳出循环
          break;
        }
      }
    });
  }

  /**
   * 更新 activeHeading
   * @param {HTMLElement} newActiveHeading
   */
  _updateActiveHeading(newActiveHeading) {
    this.activeHeading = newActiveHeading;
  }

  /**
   * 在页面滚动的过程中实时修改 url Hash
   * @param {HTMLElement} newActiveHeading
   */
  _changeUrlHashByActiveHeading(newActiveHeading) {
    // 如果当前有滚动目标就停止改写 url Hash
    if (this._scrollingTarget === null) {
      location.hash = "#" + newActiveHeading.id;
    }
  }
}
