import store from './store'

export default type => (target, key, descriptor) => {
  const method = descriptor.value

  descriptor.value = function (s, action) {
    const returned = method.apply(this, arguments)

    if (returned && typeof returned.then === 'function') {
      returned.then(resolved => s[store.handleAction]({ type, detail: resolved }))
    } else {
      s[store.handleAction]({ type, detail: returned })
    }

    return returned
  }
}
