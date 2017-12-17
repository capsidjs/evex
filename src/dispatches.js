import store from './store'

export default type => (target, key, descriptor) => {
  const method = descriptor.value

  descriptor.value = function () {
    const returned = method.apply(this, arguments)

    // Retrieves stashed store in module instance
    const str = this[store.key]

    if (returned && typeof returned.then === 'function') {
      returned.then(resolved => str[store.handleAction]({ type, detail: resolved }))
    } else {
      str[store.handleAction]({ type, detail: returned })
    }

    return returned
  }
}
