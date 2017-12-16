import { describe, it } from 'kocha'
import { store, action, dispatches } from '../'
import { mount } from 'capsid'
import genel from 'genel'
import { expect } from 'chai'

describe('dispatches', () => {
  it('dispatches the given action after the method execution', done => {
    class Module {
      @dispatches('bar')
      @action foo () {
        return 'baz'
      }

      @action bar (store, { detail }) {
        expect(detail).to.equal('baz')
        done()
      }
    }

    @store({ modules: [Module] })
    class Store {}

    mount(Store, genel.div``).el.dispatchEvent(new CustomEvent('foo'))
  })

  it('dispatches the given action after the promise resolved then the returned value is a promise', done => {
    class Module {
      @dispatches('bar')
      @action foo () {
        return Promise.resolve('baz')
      }

      @action bar (store, { detail }) {
        expect(detail).to.equal('baz')
        done()
      }
    }

    @store({ modules: [Module] })
    class Store {}

    mount(Store, genel.div``).el.dispatchEvent(new CustomEvent('foo'))
  })
})
