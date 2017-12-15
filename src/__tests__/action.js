import action from '../action'
import { describe, it } from 'kocha'
import { expect } from 'chai'

describe('@action', () => {
  it('adds actions property to the class', () => {
    class Class {
      @action test () {
      }
    }

    expect(Class.actions).to.eql(['test'])
  })
})
