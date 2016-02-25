import _ from 'lodash'
import Ember from 'ember'

const validators = {
  EmberObject: function (ctx, name, value, def, logErrors) {
    const valid = Ember.Object.prototype.isPrototypeOf(value)

    if (!valid && logErrors) {
      Ember.Logger.warn(`Expected property ${name} to be an Ember.Object`)
    }

    return valid
  },

  array: function (ctx, name, value, def, logErrors) {
    const valid = _.isArray(value)

    if (!valid && logErrors) {
      Ember.Logger.warn(`Expected property ${name} to be an array`)
    }

    return valid
  },

  bool: function (ctx, name, value, def, logErrors) {
    const valid = _.isBoolean(value)

    if (!valid && logErrors) {
      Ember.Logger.warn(`Expected property ${name} to be a boolean`)
    }

    return valid
  },

  func: function (ctx, name, value, def, logErrors) {
    const valid = _.isFunction(value)

    if (!valid && logErrors) {
      Ember.Logger.warn(`Expected property ${name} to be a function`)
    }

    return valid
  },

  number: function (ctx, name, value, def, logErrors) {
    const valid = _.isNumber(value)

    if (!valid && logErrors) {
      Ember.Logger.warn(`Expected property ${name} to be a number`)
    }

    return valid
  },

  object: function (ctx, name, value, def, logErrors) {
    const valid = _.isPlainObject(value)

    if (!valid && logErrors) {
      Ember.Logger.warn(`Expected property ${name} to be an object`)
    }

    return valid
  },

  string: function (ctx, name, value, def, logErrors) {
    const valid = _.isString(value)

    if (!valid && logErrors) {
      Ember.Logger.warn(`Expected property ${name} to be a string`)
    }

    return valid
  }
}

export function generateType (key) {
  return {
    isRequired: {
      required: true,
      type: key
    },
    required: false,
    type: key
  }
}

const PropTypes = {}

Object.keys(validators).forEach((key) => {
  PropTypes[key] = generateType(key)
})

validators.oneOf = function (ctx, name, value, def) {
  let valid = false

  if (!_.isArray(def.typeDefs)) {
    Ember.Logger.warn(
      'PropTypes.oneOf() requires an array of types to be passed in as an argument'
    )

    return valid
  }

  for (let i = 0, len = def.typeDefs.length; i < len; i++) {
    const typeDef = def.typeDefs[i]

    if (validators[typeDef.type](ctx, name, value, typeDef, false)) {
      valid = true
      break
    }
  }

  if (!valid) {
    const types = def.typeDefs.map((typeDef) => typeDef.type)
    Ember.Logger.warn(`Property ${name} does not match expected types: ${types.join(', ')}`)
  }

  return valid
}

PropTypes.oneOf = function (typeDefs) {
  const type = generateType('oneOf')
  type.isRequired.typeDefs = type.typeDefs = typeDefs
  return type
}

export {PropTypes}

/* eslint-disable complexity */
function validateProperty (ctx, name, def) {
  const value = ctx.get(name)

  if (value === undefined) {
    if (!def.required) {
      return
    }

    Ember.Logger.warn(`Missing required property ${name}`)

    return
  }

  if (def.type in validators) {
    validators[def.type](ctx, name, value, def, true)
  } else {
    Ember.Logger.warn(`Unknown propType ${def.type}`)
  }
}
/* eslint-enable complexity */

export const helpers = {
  validateProperty
}

export default Ember.Mixin.create({
  init: function () {
    this._super()

    const owner = Ember.getOwner(this)

    // FIXME: figure out how to do below without accessing __container__ directly
    const config = owner ? owner.__container__.lookupFactory('config:environment') : null

    // If we are in production environment then do not perform property validation
    if (!config || config.environment === 'production') {
      return
    }

    const propTypes = this.get('propTypes')

    if (!propTypes) {
      return
    }

    _.forIn(propTypes, (def, name) => {
      if (def === undefined) {
        Ember.Logger.warn(`propType for ${name} is unknown`)
        return
      }

      helpers.validateProperty(this, name, def)
    })
  }
})
