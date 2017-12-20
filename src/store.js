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

class Triple {
  constructor (module, type, key) {
    this.module = module
    this.type = type
    this.key = key
    this.handlers = []
  }

  exec (action) {
    this.execHandlers(action)
    try {
      const result = this.module[this.key](this.module[store.key], action)

      if (result && typeof result.catch === 'function') {
        result.catch(e => {
          console.log(`action execution failed: ${this.type}`)
          console.log(e.message)
          console.log(e.stack)
        })
      }

      return result
    } catch (e) {
      console.log(`action execution failed: ${this.type}`)
      throw e
    }
  }

  addHandler (handler) {
    this.handlers.push(handler)
  }

  execHandlers (action) {
    this.handlers.forEach(handler => {
      try {
        handler(action)
      } catch (e) {
        console.log(`action handler execution failed: type=${this.type}`)
        console.log(e.message)
        console.log(e.stack)
      }
    })
  }
}

/**
 * @param {Functio} cls
 * @param {Function[]} modules
 */
const decorateStore = (cls, modules) => {
  return class Store extends cls {
    constructor () {
      super()

      this.triples = {}

      this.installModules([this])
    }

    installDefaultModules () {
      this.installModules(modules.map(Module => new Module()))
    }

    /**
     * Installs the given modules into the store.
     * @param {Object[]} modules The list of modules
     */
    installModules (modules) {
      modules.forEach(module => {
        // Stashes the store in module at the hidden key
        module[store.key] = this

        const actions = module.constructor.actions

        if (!actions) {
          return
        }

        Object.keys(actions).forEach(type => {
          this.triples[type] = new Triple(
            module,
            type,
            actions[type]
          )
        })
      })
    }

    __init__ () {
      if (typeof super.__init__ === 'function') {
        super.__init__()
      }

      this.installDefaultModules()
      this[store.bindEventHandlers](this.el)
    }

    [store.bindEventHandlers] (el) {
      Object.keys(this.triples).forEach(type => {
        el.addEventListener(type, e => this.dispatch(e))
      })
    }

    /**
     * Dispatches the action.
     * @param {Object} action
     */
    dispatch (action) {
      const triple = this.triples[action.type]

      if (triple) {
        return triple.exec(action)
      } else {
        console.log(`No such action type: ${action.type}`)
      }
    }

    /**
     * Adds the handler of action type.
     */
    on (type, handler) {
      this.triples[type].addHandler(handler)
    }
  }
}

store.bindEventHandlers = ':evex:store:bindEventHandlers'
store.key = ':evex:store:key'

export default store
