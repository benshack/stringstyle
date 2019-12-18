// Defaults
const defaultOptions = {
  interval: 100,
  autoplay: true,
  deliminator: ' ',
  keepDeliminator: true,
  wrapperClass: 'stringStyleWrapper',
  beforeClass: 'stringStyleBefore', // or an array of random classes
  afterClass: 'stringStyleAfter', // or an array of random classes
  stripStylesAfter: false, // int. replaces original string after completing.
}

// Shared Variables
let stringStyles = [];
let listening = false;
let wHeight = window.innerHeight;

// Object Class
class StringStyleObj {
  constructor(elem, options = {}) {
    this.elem = elem;
    this.options = {...defaultOptions, ...options};
    this.init();
    this.reset();
    if (this.options.autoplay) this.play();
  }

  init() {
    this.content = this.elem.innerHTML.split(this.options.deliminator);
    this.targets = [];
    this.elem.innerHTML = '';
    this.content.map(content => {
      content = this.options.keepDeliminator ? content + this.options.deliminator : content;
      const wrapper = document.createElement('span');
      const target = document.createElement('span');
      wrapper.classList.add(this.options.wrapperClass);
      this.assignClass(target, this.options.beforeClass);
      target.innerHTML = content;
      wrapper.appendChild(target);
      this.elem.appendChild(wrapper);
      this.targets.push(target);
    })
  }

  reset() {
    this.complete = false;
    this.index = 0;
  }

  play() {
    if (!this.complete && this.isVisible()) this.styleController();
  }

  styleController() {
    this.assignClass(this.targets[this.index], this.options.afterClass);
    this.index = this.index + 1;

    if (this.index >= this.targets.length) {
      this.complete = true;
      if (this.options.stripStylesAfter) setTimeout(() => {
        this.stripStyles()
      }, this.options.stripStylesAfter);
    }

    if (!this.complete) {
      setTimeout(() => { this.styleController() }, this.options.interval);
    }
  }

  assignClass(elem, select) {
    if (Array.isArray(select)) {
      const classIndex = random(0, select.length - 1);
      elem.classList.add(select[classIndex]);
    } else {
      elem.classList.add(select);
    }
  }

  stripStyles() {
    this.elem.innerHTML = this.content.join(this.options.deliminator);
  }

  // Object Helpers
  isVisible() {
    const rect = this.elem.getBoundingClientRect();
    return rect.top < wHeight && rect.bottom > 0;
  }
}

// Listeners
const initListeners = () => {
  window.addEventListener('resize', () => {
    wHeight = window.innerHeight;
    playVisible();
  })

  window.addEventListener('scroll', () => {
    playVisible();
  })
}

// Helpers
const makeStyleObj = (target, options) => {
  const stringStyle = new StringStyleObj(target, options);
  stringStyles.push(stringStyle);
}

const playVisible = () => {
  Array.from(stringStyles).forEach(stringStyle => {
    if (stringStyle.options.autoplay) stringStyle.play();
  })
}

const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Export
export default (target, options = {}) => {
  if (typeof(target) === 'string') {
    target = document.querySelectorAll(`${target}`);
  }

  if (target.length <= 0) return false;

  if (target) {
    if (target.length >= 1) {
      Array.from(target).forEach(elem => {
        makeStyleObj(elem, options);
      })
    } else {
      makeStyleObj(target, options);
    }

    if (!listening) {
      initListeners();
      listening = true;
    }
  }
}
