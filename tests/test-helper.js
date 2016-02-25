import resolver from './helpers/resolver'
import {setResolver} from 'ember-mocha'

const flag = chai.util.flag

// Taken from chai-subset
function compare (expected, actual) {
  if (typeof (actual) !== typeof (expected)) {
    return false
  }
  if (typeof (expected) !== 'object' || expected === null) {
    return expected === actual
  }
  if (!!expected && !actual) {
    return false
  }

  if (Array.isArray(expected)) {
    if (typeof (actual.length) !== 'number') {
      return false
    }
    var aa = Array.prototype.slice.call(actual)
    return expected.every(function (exp) {
      return aa.some(function (act) {
        return compare(exp, act)
      })
    })
  }

  if (expected instanceof Date && actual instanceof Date) {
    return expected.getTime() === actual.getTime()
  }

  return Object.keys(expected).every(function (key) {
    var eo = expected[key]
    var ao = actual[key]
    if (typeof (eo) === 'object' && eo !== null && ao !== null) {
      return compare(eo, ao)
    }
    return ao === eo
  })
}

// Taken from chai-subset
chai.Assertion.addMethod('containSubset', function (expected) {
  var actual = flag(this, 'object')
  var showDiff = chai.config.showDiff

  this.assert(
    compare(expected, actual),
    'expected #{act} to contain subset #{exp}',
    'expected #{act} to not contain subset #{exp}',
    expected,
    actual,
    showDiff
  )
})

// Taken from chai-subset
chai.assert.containSubset = function (val, exp, msg) {
  new chai.Assertion(val, msg).to.be.containSubset(exp)
}

// Taken from chai-jquery
chai.Assertion.addMethod('class', function (className) {
  this.assert(
    flag(this, 'object').hasClass(className),
    'expected #{this} to have class #{exp}',
    'expected #{this} not to have class #{exp}',
    className
  )
})

// Taken from chai-jquery
chai.Assertion.overwriteChainableMethod('contain',
  function (_super) {
    return function (text) {
      var obj = flag(this, 'object')
      if ('jquery' in obj) {
        this.assert(
            obj.is(':contains(\'' + text + '\')')
          , 'expected #{this} to contain #{exp}'
          , 'expected #{this} not to contain #{exp}'
          , text)
      } else {
        _super.apply(this, arguments)
      }
    }
  },
  function (_super) {
    return function () {
      _super.call(this)
    }
  }
)

setResolver(resolver)
