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
  }

  exec (action) {
    try {
      return this.module[this.key](this.module[store.key], action)
    } catch (e) {
      console.log(`action execution failed: ${this.type}`)
      throw e
    }
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
        el.addEventListener(type, e => this[store.handleAction](e))
      })
    }

    /**
     * Dispatches the action.
     * @param {Object} action
     */
    dispatch (action) {
      return this[store.handleAction](action)
    }

    [store.handleAction] (action) {
      const triple = this.triples[action.type]

      if (triple) {
        return triple.exec(action)
      } else {
        console.log(`No such action type: ${action.type}`)
      }
    }
  }
}

store.bindEventHandlers = ':evex:store:bindEventHandlers'
store.handleAction = ':evex:store:handleAction'
store.key = ':evex:store:key'

export default store
