import store from './store'

export default type => (target, key, descriptor) => {
  const method = descriptor.value

  descriptor.value = function () {
    const returned = method.apply(this, arguments)

    // Retrieves stashed store in module instance
    const str = this[store.key]

    if (returned && typeof returned.then === 'function') {
      returned.then(resolved => dispatch(str, type, resolved ))
    } else {
      dispatch(str, type, returned)
    }

    return returned
  }
}

const dispatch = (store, type, detail) => {
  try {
    store.dispatch({ type, detail })
  } catch (e) {
    console.log(e.message)
    console.log(e)
  }
}
