import {expect} from 'chai'
import {describe, it} from 'mocha'
import {add} from 'ember-frost-bunsen/helpers/add'

describe('Unit | Helper | add', function () {
  // Replace this with your real tests.
  it('adds numbers', function () {
    let result = add([40, 2])
    expect(result).to.be.equal(42)
  })

  it('can add more than two numbers', function () {
    let result = add([23, 24, 25, 23, 5])
    expect(result).to.be.equal(100)
  })
})

