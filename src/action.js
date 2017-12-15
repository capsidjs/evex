/**
 * `action` decorator, this registers the decorated method as an action
 * @param {Object} target
 * @param {string} key
 * @param {Object} descriptor
 */
export default (target, key, descriptor) => {
  const constructor = target.constructor
  constructor.actions = constructor.actions || []

  constructor.actions.push(key)
}
