import {expect} from 'chai'
import {describe, it} from 'mocha'

import treeUtils from 'ember-frost-bunsen/tree-utils'

describe('treeUtils', function () {
  describe('isCommonAncestor', function () {
    it('returns true when first param is ancestor to second', function () {
      expect(treeUtils.isCommonAncestor('root', 'root.foo')).to.equal(true)
    })

    it('returns true when second param is ancestor to first', function () {
      expect(treeUtils.isCommonAncestor('root.foo', 'root')).to.equal(true)
    })

    it('returns true when both params are the same', function () {
      expect(treeUtils.isCommonAncestor('root', 'root'))
    })

    it('return true when first param is ancestor to second with non-converted path id', function () {
      expect(treeUtils.isCommonAncestor('root', 'foo'))
    })
  })

  describe('findCommonAncestor', function () {
    it('returns the same segment when all params are the same', function () {
      expect(treeUtils.findCommonAncestor(['root.foo', 'root.foo'])).to.equal('root.foo')
    })

    it('returns the a common parent when all params are related', function () {
      expect(treeUtils.findCommonAncestor(['root.foo', 'root.bar'])).to.equal('root')
    })
  })
})
