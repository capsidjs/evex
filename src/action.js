/**
 * `action` decorator, this registers the decorated method as an action
 * @param {string} type
 * @param {Object} descriptor
 */
export default type => descriptor => {
  const key = descriptor.key
  descriptor.finisher = constructor => {
    const actions = constructor.actions = constructor.actions || {}

    if (actions[type]) {
      throw new Error('actions of the same type are registered more than twice')
    }

    actions[type] = key
  }
}
