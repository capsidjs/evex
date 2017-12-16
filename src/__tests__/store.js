import { expect } from 'chai'
import { describe, it, context } from 'kocha'
import { action, store } from '../'
import { component, mount } from 'capsid'
import genel from 'genel'

describe('@store', () => {
  it('decorates the class to add event handlers to .el property the event handler and it reacts to the given action types', done => {
    class Module0 {
      @action bar () {}
    }

    class Module1 {
      @action foo (store, { detail }) {
        expect(store).to.be.instanceof(Store)
        expect(detail).to.equal('baz')
        done()
      }
    }

    @component
    @store({ modules: [Module0, Module1] })
    class Store {}

    mount(Store, genel.div``).el.dispatchEvent(new CustomEvent('foo', { detail: 'baz' }))
  })

  context('when the store has __init__ method', () => {
    it('calls the original __init__ method', done => {
      class Module {
        @action foo () {}
      }

      @component
      @store({ modules: [Module] })
      class Store {
        __init__ () {
          done()
        }
      }

      mount(Store, genel.div``)
    })
  })
})
