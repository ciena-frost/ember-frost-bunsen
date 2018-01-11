import {utils} from 'bunsen-core'
const {parseVariables} = utils
import Ember from 'ember'
const {get} = Ember

export function getAttr (attrs, name) {
  if (!attrs) {
    return undefined
  }

  if (name.indexOf('.') === -1) {
    return get(attrs, `${name}.value`)
  }

  const segments = name.split('.')
  const firstSegment = segments.splice(0, 1)
  const remainingPath = segments.join('.')

  return get(attrs, `${firstSegment}.value.${remainingPath}`)
}

/* eslint-disable complexity */
export function getOption (attrs, optionName, formValue, fallback = '', useValue = true) {
  if (!attrs) {
    return undefined
  }

  const bunsenId = getAttr(attrs, 'bunsenId')
  const configOption = getAttr(attrs, `cellConfig.renderer.${optionName}`)
  const value = getAttr(attrs, 'value')

  if (!configOption && useValue) {
    return value
  }

  const mutableFormValue = formValue ? formValue.asMutable({deep: true}) : {}

  return parseVariables(mutableFormValue, configOption, bunsenId, true) || fallback
}
/* eslint-enable complexity */
