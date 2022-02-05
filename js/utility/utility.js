"use strict";
class Utility {
  addEventListener(event, element, handler) {
    if (document.addEventListener) {
      element.addEventListener(event, handler);
    } else {
      element.attachEvent("on" + event, handler);
    }
  }

  getHTML(template) {
    var templateCreator;
    if (!templateCreator) templateCreator = document.createElement("div");
    templateCreator.innerHTML = template;
    return templateCreator.firstChild;
  }

  getFromLocalStorage(key) {
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, "[]");
      return JSON.parse(localStorage.getItem(key));
    } else {
      return JSON.parse(localStorage.getItem(key));
    }
  }

  addToLocalStorage(key, item) {
    let value = this.getFromLocalStorage(key);
    value.push(item);
    localStorage.setItem(key, JSON.stringify(value));
  }

  resetLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  debounce(callback, delay) {
    let timer;
    return (...args) => {
      const self = this;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback.call(self, ...args);
      }, delay);
    };
  }

  getJSONData(url) {
    return fetch(url).then(resp => resp.json());
  }
}

export default new Utility();
