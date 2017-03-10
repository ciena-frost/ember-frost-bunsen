import Ember from 'ember'
const {get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-table'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-table',
    'frost-field'
  ],

  layout,

  columns: [
    {label: 'foo', propertyName: 'foo'},
    {label: 'bar', propertyName: 'bar'},
    {label: 'baz', propertyName: 'baz'}
  ],

  items: [
    {foo: 'foo1', bar: 'bar1', baz: 'baz1'},
    {foo: 'foo2', bar: 'bar2', baz: 'baz2'},
    {foo: 'foo3', bar: 'bar3', baz: 'baz3'},
    {foo: 'foo4', bar: 'bar4', baz: 'baz4'}
  ],

  hook: 'somehook'
})
