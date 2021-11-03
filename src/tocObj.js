import { scrollToTarget } from "./utils.js";
import { UPDATE_ACTIVE_HEADING_EVENT, SCROLL_TIME } from "./constance.js";

export default class TocObj {
  constructor(
    el,
    toc,
    deep = 1,
    level = 1,
    sectionNumbers = [0, 0, 0, 0, 0, 0]
  ) {
    this.el = el;
    this.el.circular = this;
    this.toc = toc;
    this.options = toc.options;
    this.deep = deep;
    this.level = level;
    this.sectionNumbers = sectionNumbers;
    // 当前节点的数量
    this.num = 0;
  }

  /**
   * 为 Toc 对象添加标题
   * @param {HTMLHeadingElement} heading
   * @returns
   */
  add(heading) {
    let level = Number(heading.tagName.charAt(1));

    // 如果当前节点为 ul
    if (this.el.tagName == "UL") {
      // 检查是否在该深度停止生成目录解构
      if (this.options.deep < this.deep) {
        return;
      }
      this.el.setAttribute("data-deep", this.deep);

      // 如果将要处理的 heading 等级与当前的 ul 等级相匹配
      // 那就创建一个 li 将其存放
      if (level == this.level) {
        let link = document.createElement("a");
        link.innerHTML = heading.innerHTML;

        // 记录标题计数器
        this.sectionNumbers[level - 1]++;
        for (let i = level; i < this.sectionNumbers.length; i++) {
          this.sectionNumbers[i] = 0;
        }

        // 设置各个目录项 HTML Attribute
        link.setAttribute(
          "data-index",
          this.sectionNumbers.slice(0, level).join(".")
        );
        link.setAttribute("data-level", level);
        if (heading.id) {
          link.setAttribute("data-heading", heading.id);
          // 当 toc 实例中的 activeHeading 发生改变时，修改目录中对应元素的 class
          this.toc._eventHub.addEventListener(
            UPDATE_ACTIVE_HEADING_EVENT,
            (newActiveHeading) => {
              if (newActiveHeading.id === link.getAttribute("data-heading")) {
                link.classList.add(this.options.tocActiveClass)
              } else {
                link.classList.remove(this.options.tocActiveClass)
              }
            }
          );
          // 如果启用锚点选项，使用锚点进行跳转
          if (this.options.hashMode) {
            link.href = "#" + heading.id;
            if (this.options.smoothScroll) {
              this.options.scrollContainer.style.scrollBehavior = "smooth";
            }
            // 记录当前正在跳转的目标元素
            link.addEventListener("click", () => {
              this.toc._scrollingTarget = heading;
              if (this.toc._scrollingTargetCleanTimer) {
                clearTimeout(this.toc._scrollingTargetCleanTimer);
              }
              this.toc._scrollingTargetCleanTimer = setTimeout(() => {
                this.toc._scrollingTarget = null;
              }, SCROLL_TIME);
            });
          }
          // 如果关闭锚点选项，使用 scrollTo 进行跳转
          else {
            link.addEventListener("click", () => {
              scrollToTarget(heading.id, this.options);
            });
          }
        }

        // 创建一个 li 元素并插入到当前 ul 中
        let li = document.createElement("li");
        li.insertBefore(link, li.firstChild);
        this.num++;

        // 创建新的 Toc 对象，并插入到当前的元素节点中
        const newTocObj = new TocObj(
          li,
          this.toc,
          this.deep,
          level,
          this.sectionNumbers
        );
        this.el.appendChild(newTocObj.el);
      }
      // 如果当前 heading 的等级大于当前 ul 等级
      else if (level > this.level) {
        let lastChild = this.el.lastChild;
        lastChild.circular.add(heading); // 让ul节点的li节点去处理heading
      }
    }

    // 如果当前节点为 li
    else {
      // 没有ul子节点，就创建一个
      if (this.num == 0) {
        let ul = document.createElement("ul");
        let newObj = new TocObj(
          ul,
          this.toc,
          this.deep + 1,
          level,
          this.sectionNumbers
        );
        this.el.appendChild(newObj.el);
        this.num++;
        newObj.add(heading);
      } else {
        let lastChild = this.el.lastChild;
        lastChild.circular.add(heading);
      }
    }
  }
}
