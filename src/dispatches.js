import store from './store'
import debugMessage from './debug-message'

export default type => (target, key, descriptor) => {
  const method = descriptor.value

  descriptor.value = function () {
    const returned = method.apply(this, arguments)

    // Retrieves stashed store in module instance
    const str = this[store.key]

    if (returned && typeof returned.then === 'function') {
      returned.then(resolved => dispatch(str, type, resolved))
    } else {
      dispatch(str, type, returned)
    }

    return returned
  }
}

const dispatch = (store, type, detail) => {
  try {
    store.dispatch({ type, detail })
    if (__DEV__) {
      debugMessage({
        type: 'event',
        coelem: store,
        color: 'indianred',
        e: { type },
        module: '🎧'
      })
    }
  } catch (e) {
    if (__DEV__) {
      console.log(e.message)
      console.log(e)
    }
  }
}
