/**
 * @param {Object} opts
 * @param {Function[]} opts.modules
 * @param {Functio} cls
 */
const store = (opts = {}) => {
  if (typeof opts === 'function') {
    return decorateStore(opts, [])
  }

  return cls => decorateStore(cls, opts.modules || [])
}

/**
 * @param {Functio} cls
 * @param {Function[]} modules
 */
const decorateStore = (cls, modules) => {
  return class Store extends cls {
    constructor () {
      super()

      this.modules = modules.map(Module => new Module())
      this.modules.unshift(this) // Store itself works as a module
    }

    __init__ () {
      if (typeof super.__init__ === 'function') {
        super.__init__()
      }

      this[store.bindEventHandlers](this.el)
    }

    [store.bindEventHandlers] (el) {
      this[store.getActionTypes]().forEach(type => {
        el.addEventListener(type, e => this[store.handleAction](e))
      })
    }

    [store.getActionTypes] () {
      return [].concat.apply([], modules.map(Module => Module.actions)).filter(Boolean)
    }

    [store.handleAction] ({ type, detail }) {
      this.modules.some(module => {
        if (module[type]) {
          // Calls action
          try {
            module[type](this, { type, detail })
          } catch (e) {
            console.log(`action execution failed: ${type}`)
            console.log(e)
          }

          return true
        }
      })
    }
  }
}

store.bindEventHandlers = ':store:bind:event:handlers'
store.getActionTypes = ':store:get:action:types'
store.handleAction = ':store:handle:action'

export default store
