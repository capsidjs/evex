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

  exec (store, action) {
    try {
      this.module[this.key](store, action)
    } catch (e) {
      console.log(`action execution failed: ${this.type}`)
      console.log(e)
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

      this.modules = modules.map(Module => new Module())
      this.modules.unshift(this) // Store itself works as a module

      this.triples = [].concat.apply([], this.modules.map(module => {
        const actions = module.constructor.actions

        if (!actions) {
          return []
        }

        return Object.keys(actions).map(type => new Triple(
          module,
          type,
          actions[type]
        ))
      }))

      this.tripleMap = {}

      this.triples.forEach(triple => {
        this.tripleMap[triple.type] = triple
      })
    }

    __init__ () {
      if (typeof super.__init__ === 'function') {
        super.__init__()
      }

      this[store.bindEventHandlers](this.el)
    }

    [store.bindEventHandlers] (el) {
      this.triples.forEach(triple => {
        el.addEventListener(triple.type, e => this[store.handleAction](e))
      })
    }

    [store.handleAction] (action) {
      const triple = this.tripleMap[action.type]

      if (triple) {
        triple.exec(this, action)
      } else {
        throw new Error(`No such action type: ${action.type}`)
      }
    }
  }
}

store.bindEventHandlers = ':store:bind:event:handlers'
store.handleAction = ':store:handle:action'

export default store
