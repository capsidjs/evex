const handleAction = ':store:handle:action'
/**
 * @param {Object} actionMap
 * @param {Functio} cls
 */
const store = ({ modules }) => cls => {
  return class extends cls {
    constructor () {
      super()

      this.modules = modules.map(Module => new Module)
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
          module[type](this, { type, detail })

          return true
        }
      })
    }
  }
}

store.bindEventHandlers = ':store:bind:event:handlers'
store.getActionTypes= ':store:get:action:types'
store.handleAction = ':store:handle:action'

export default store
