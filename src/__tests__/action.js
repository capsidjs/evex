import action from '../action'
import { describe, it } from 'kocha'
import { expect } from 'chai'

describe('@action', () => {
  it('adds actions property to the class', () => {
    class Class {
      @action('foo') test0 () {}
      @action('bar') test1 () {}
    }

    expect(Class.actions).to.eql({
      foo: 'test0',
      bar: 'test1'
    })
  })

  it('throws when the same name action is registered more than once', () => {
    expect(() => {
      class Class {
        @action('foo') test0 () {}
        @action('foo') test1 () {}
      }
    }).to.throw()
  })
})
