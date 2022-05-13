/**
 * Add styles to document head
 *
 * @param {String} styles CSS styles to add
 * @returns {void}
 */
export const addStyles = styles => {
  const styleBlock = document.createElement('style')
  styleBlock.appendChild(document.createTextNode(styles))
  document.head.appendChild(styleBlock)
}

/**
 * Return a random integer between min/max values
 *
 * @param {Number} min Minimum number to generate
 * @param {Number} max Maximum number to generate
 * @author Tameem Safi <tamem@safi.me.uk>
 */
export const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
