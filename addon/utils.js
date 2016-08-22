import _ from 'lodash'
import Ember from 'ember'
const {A} = Ember

/**
 * @typedef {Object} Facet
 * @property {String} label - label to use for facet
 * @property {String} model - model property to generate facet for
 * @property {BunsenRenderer} [renderer] - renderer to use for facet
 */

export const builtInRenderers = {
  boolean: 'frost-bunsen-input-boolean',
  'button-group': 'frost-bunsen-input-button-group',
  integer: 'frost-bunsen-input-number',
  link: 'frost-bunsen-input-link',
  'multi-select': 'frost-bunsen-input-multi-select',
  number: 'frost-bunsen-input-number',
  password: 'frost-bunsen-input-password',
  'property-chooser': 'frost-bunsen-input-property-chooser',
  select: 'frost-bunsen-input-select',
  string: 'frost-bunsen-input-text',
  textarea: 'frost-bunsen-input-textarea',
  url: 'frost-bunsen-input-url'
}

export function deemberify (emberObject) {
  if (emberObject === null || emberObject === undefined) {
    return emberObject
  }

  if (_.isFunction(emberObject.serialize)) {
    return emberObject.serialize()
  }

  if (emberObject.content) {
    return emberObject.content.map((contentObject) => {
      return JSON.parse(JSON.stringify(contentObject._data))
    })
  }

  if (emberObject._prevContent) {
    return emberObject._prevContent.map((contentObject) => {
      return JSON.parse(JSON.stringify(contentObject._data))
    })
  }

  return JSON.parse(JSON.stringify(emberObject))
}

import Ember from 'ember'

/**
 * Generate label from bunsen model
 * @param {String} model - bunsen model/property path
 * @returns {String} model converted to label
 */
export function generateLabelFromModel (model) {
  const property = model.split('.').pop()
  const dasherizedName = Ember.String.dasherize(property).replace('-', ' ')
  return Ember.String.capitalize(dasherizedName)
}

/**
 * Generate cell for a facet
 * @param {Facet} facet - facet to generate cell for
 * @returns {BunsenCell} bunsen cell for facet
 */
export function generateFacetCell (facet) {
  const cell = {
    model: facet.model
  }

  if (facet.renderer) {
    cell.renderer = facet.renderer
  }

  return {
    children: [cell],
    collapsible: true,
    label: facet.label || generateLabelFromModel(facet.model)
  }
}

/**
 * Generate bunsen view for facets
 * @param {Facet[]} facets - facets to generate view for
 * @returns {BunsenView} bunsen view for facets
 */
export function generateFacetView (facets) {
  return {
    cells: [
      {
        children: facets.map(generateFacetCell)
      }
    ],
    type: 'form',
    version: '2.0'
  }
}


export function recursiveObjectCreate (object) {
  if (_.isPlainObject(object)) {
    let newObj = {}
    _.forEach(object, function (value, key) {
      newObj[key] = recursiveObjectCreate(value)
    })

    return Ember.Object.create(newObj)
  } else if (_.isArray(object)) {
    let newArray = []
    _.forEach(object, function (value) {
      newArray.push(recursiveObjectCreate(value))
    })

    return A(newArray) // eslint-disable-line new-cap
  }

  return object
}

export function getRendererComponentName (rendererName) {
  return builtInRenderers[rendererName] || rendererName
}

export function validateRenderer (owner, rendererName) {
  return rendererName in builtInRenderers || owner.hasRegistration(`component:${rendererName}`)
}
