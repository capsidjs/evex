import { describe, it, context } from 'kocha'
import { store, action, dispatches } from '../'
import { component, mount } from 'capsid'
import genel from 'genel'
import { expect } from 'chai'

describe('dispatches', () => {
  it('dispatches the given action after the method execution', done => {
    class Module {
      @dispatches('bar')
      @action('foo') foo () {
        return 'baz'
      }

      @action('bar') bar (store, { detail }) {
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
      @action('foo') foo () {
        return Promise.resolve('baz')
      }

      @action('bar') bar (store, { detail }) {
        expect(detail).to.equal('baz')
        done()
      }
    }

    @store({ modules: [Module] })
    class Store {}

    mount(Store, genel.div``).el.dispatchEvent(new CustomEvent('foo'))
  })

  context('when dispatched action type does not exist', () => {
    it('does not throws', () => {
      @store()
      class Store {
        @dispatches('bar')
        @action('foo') foo () {}
      }

      const str = mount(Store, genel.div``)
      expect(() => {
        str.foo(str, {})
      }).to.not.throw()
    })
  })

  context('when dispatched method throws', () => {
    it('does not be affected', () => {
      @store()
      @component('store')
      class Store {
        @dispatches('bar')
        @action('foo') foo () {
          return 42
        }

        @action('bar') bar () {
          throw new Error('bar error')
        }
      }

      const s = mount(Store, genel.div``)

      const returned = s.foo(s, {})

      expect(returned).to.equal(42)
    })
  })
})
