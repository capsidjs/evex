import { expect } from 'chai'
import { describe, it, context } from 'kocha'
import { action, store } from '../'
import { component, mount } from 'capsid'
import genel from 'genel'
import td from 'testdouble'

describe('@store', () => {
  it('decorates the class to add event handlers to .el property the event handler and it reacts to the given action types', done => {
    class Module0 {
      @action('bar') bar () {}
    }

    class Module1 {
      @action('foo') foo (store, { detail }) {
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
        @action('foo') foo () {}
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

  context('when options are empty', () => {
    it('can work normally', () => {
      @component
      @store()
      class Store {
      }

      mount(Store, genel.div``)
    })
  })

  describe('dispatch', () => {
    it('dispatches the action', () => {
      @component
      @store
      class Store {
        @action('foo') foo () {
          return 42
        }
      }

      expect(mount(Store, genel.div``).dispatch({ type: 'foo' })).to.equal(42)
    })

    context('when dispatched action returns rejected promise', () => {
      it('shows error in console', () => {
        @component
        @store
        class Store {
          @action('foo') foo () {
            return Promise.reject(new Error())
          }
        }

        td.replace(console, 'log')

        const result = mount(Store, genel.div``).dispatch({ type: 'foo' })

        result.catch(e => {
          td.verify(console.log('action execution failed: foo'))
          td.reset()
        })
      })
    })
  })

  describe('on', () => {
    it('appends additional action handler to the given action type', done => {
      @component
      @store
      class Store {
        @action('foo') foo () {
        }
      }

      const s = mount(Store, genel.div``)

      s.on('foo', ({ detail }) => {
        expect(detail).to.equal(42)
        done()
      })

      s.dispatch({ type: 'foo', detail: 42 })
    })

    context('when handler throws', () => {
      it('shows error log in console', () => {
        @component
        @store
        class Store {
          @action('foo') foo () {
          }
        }

        const s = mount(Store, genel.div``)

        s.on('foo', ({ detail }) => {
          expect(detail).to.equal(42)
          throw new Error('abc')
        })

        td.replace(console, 'log')

        s.dispatch({ type: 'foo', detail: 42 })

        td.verify(console.log('action handler execution failed: type=foo'))
        td.reset()
      })
    })
  })
})
