import { getRandomInteger, addStyles } from './utils.js'
import { STYLES } from './constants.js'

class Typewriter {
  #state = {
    eventQueue: [],
    eventLoopPaused: true,
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
    defaultPauseFor: 1500,
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

  /**
   * Replace all child nodes of provided element with
   * state wrapper element used for typewriter effect
   */
  setupWrapperElement() {
    if (!this.#state.elements.container) return

    this.#state.elements.wrapper.className = this.#options.wrapperClassName
    this.#state.elements.cursor.className = this.#options.cursorClassName

    this.#state.elements.cursor.innerHTML = this.#options.cursor
    this.#state.elements.container.innerHTML = ''

    this.#state.elements.container.appendChild(this.#state.elements.wrapper)
    this.#state.elements.container.appendChild(this.#state.elements.cursor)
  }

  #addToQueue(cb) {
    this.#state.eventQueue.push(() => new Promise(cb))
  }

  /**
   * Adds string characters to event queue for typing
   *
   * @param {String} string String to type
   * @return {Typewriter} Typewriter
   */
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

  /**
   * Add delete character to event queue for amount of characters provided
   *
   * @param {Number} amount Number of characters to remove
   * @return {Typewriter} Typewriter
   */
  deleteChars(amount) {
    if (!amount) {
      throw new Error('Must provide amount of characters to delete')
    }
    this.#addToQueue(resolve => {
      let i = 0
      const interval = setInterval(() => {
        this.#state.elements.wrapper.innerText = this.#state.elements.wrapper.innerText.substring(
          0,
          this.#state.elements.wrapper.innerText.length - 1
        )
        i++
        if (i >= amount) {
          clearInterval(interval)
          resolve()
        }
      }, this.#options.deleteSpeed)
    })

    return this
  }

  /**
   * Add delete all characters to event queue
   *
   * @param {Number} ms Time in ms to deleteAll
   * @return {Typewriter} Typewriter
   */
  deleteAll(ms = this.#options.deleteSpeed) {
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
      }, ms)
    })

    return this
  }

  /**
   * Add pause event to queue for ms provided
   *
   * @param {Number} ms Time in ms to pause for
   * @return {Typewriter} Typewriter
   */
  pauseFor(ms = this.#options.defaultPauseFor) {
    this.#addToQueue(resolve => {
      setTimeout(resolve, ms)
    })

    return this
  }

  /**
   * Pause the event loop
   *
   * @return {Typewriter} Typewriter
   */
  pause() {
    this.#state.eventLoopPaused = true

    return this
  }

  /**
   * Start typewriter effect
   *
   * @return {Typewriter} Typewriter
   */
  start() {
    if (!this.#state.eventLoopPaused) {
      return this
    }
    this.#state.eventLoopPaused = false
    this.runEventLoop()

    return this
  }

  /**
   * Run the event loop and do anything inside of the queue
   */
  async runEventLoop() {
    let cb = this.#state.eventQueue.shift()
    while (cb != null) {
      // Check if event loop is paused
      if (this.#state.eventLoopPaused) {
        break
      }
      await cb()
      if (this.#options.loop) this.#state.eventQueue.push(cb)
      cb = this.#state.eventQueue.shift()
    }
  }
}

export default Typewriter
