import { getRandomInteger, addStyles } from './utils.js'
import { STYLES } from './constants.js'

class Typewriter {
  #queue = []
  #state = {
    elements: {
      container: null,
      wrapper: document.createElement('span'),
      cursor: document.createElement('span'),
    },
  }
  #options = {
    loop: false,
    delay: getRandomInteger(120, 160),
    deleteSpeed: getRandomInteger(40, 80),
    wrapperClassName: 'Typewriter__wrapper',
    cursorClassName: 'Typewriter__cursor',
    cursor: '|',
    skipAddStyles: false,
  }

  constructor(container, options) {
    if (container) {
      if (typeof container === 'string') {
        const containerElement = document.querySelector(container)

        if (!containerElement) {
          throw new Error('Could not find container element')
        }

        this.#state.elements.container = containerElement
      } else {
        this.#state.elements.container = container
      }
    }

    if (options) {
      this.#options = {
        ...this.#options,
        ...options,
      }
    }

    this.init()
  }

  init() {
    this.setupWrapperElement()

    if (window && !window.___TYPEWRITER_JS_STYLES_ADDED___ && !this.#options.skipAddStyles) {
      addStyles(STYLES)
      window.___TYPEWRITER_JS_STYLES_ADDED___ = true
    }
  }

  setupWrapperElement = () => {
    if (!this.#state.elements.container) return

    this.#state.elements.wrapper.className = this.#options.wrapperClassName
    this.#state.elements.cursor.className = this.#options.cursorClassName

    this.#state.elements.cursor.innerHTML = this.#options.cursor
    this.#state.elements.container.innerHTML = ''

    this.#state.elements.container.appendChild(this.#state.elements.wrapper)
    this.#state.elements.container.appendChild(this.#state.elements.cursor)
  }

  #addToQueue(cb) {
    this.#queue.push(() => new Promise(cb))
  }

  typeString(string) {
    this.#addToQueue(resolve => {
      let i = 0
      const interval = setInterval(() => {
        this.#state.elements.wrapper.append(string[i])
        i++
        if (i >= string.length) {
          clearInterval(interval)
          resolve()
        }
      }, this.#options.delay)
    })

    return this
  }

  deleteChars(number) {
    this.#addToQueue(resolve => {
      let i = 0
      const interval = setInterval(() => {
        this.#state.elements.wrapper.innerText = this.#state.elements.wrapper.innerText.substring(
          0,
          this.#state.elements.wrapper.innerText.length - 1
        )
        i++
        if (i >= number) {
          clearInterval(interval)
          resolve()
        }
      }, this.#options.deleteSpeed)
    })

    return this
  }

  deleteAll(deleteSpeed = this.#options.deleteSpeed) {
    this.#addToQueue(resolve => {
      const interval = setInterval(() => {
        this.#state.elements.wrapper.innerText = this.#state.elements.wrapper.innerText.substring(
          0,
          this.#state.elements.wrapper.innerText.length - 1
        )
        if (this.#state.elements.wrapper.innerText.length === 0) {
          clearInterval(interval)
          resolve()
        }
      }, deleteSpeed)
    })

    return this
  }

  pauseFor(duration) {
    this.#addToQueue(resolve => {
      setTimeout(resolve, duration)
    })

    return this
  }

  async start() {
    let cb = this.#queue.shift()
    while (cb != null) {
      await cb()
      if (this.#options.loop) this.#queue.push(cb)
      cb = this.#queue.shift()
    }

    return this
  }
}

export default Typewriter
