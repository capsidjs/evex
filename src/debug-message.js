/**
 * Logs the debug message.
 * @param {Object} message The debug message
 */
export default message => {
  if (typeof capsidDebugMessage === 'function') {
    capsidDebugMessage(message)
  }
}
