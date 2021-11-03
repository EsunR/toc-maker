/**
 * 页面滚动到目标位置
 * @param {String} elementId
 */
export function scrollToTarget(elementId, options) {
  const { scrollContainer } = options;
  const targetEl = document.getElementById(elementId);
  scrollContainer.scrollTo({
    top: targetEl.offsetTop,
    behavior: options.smoothScroll ? "smooth" : "auto",
  });
}

export class EventHub {
  constructor() {
    this.events = {};
  }

  /**
   * 添加监听
   * @param {String} eventId
   * @param {Function} callback
   */
  addEventListener(eventId, callback) {
    if (Object.prototype.hasOwnProperty.call(this.events, eventId)) {
      this.events[eventId].push(callback);
    } else {
      this.events[eventId] = [callback];
    }
  }

  /**
   * 发布事件
   * @param {String} eventId
   * @param {any} payload
   */
  publish(eventId, payload) {
    const targetEvent = this.events[eventId];
    if (targetEvent instanceof Array) {
      targetEvent.forEach((item) => {
        if (typeof item === "function") {
          item(payload);
        }
      });
    }
  }
}
