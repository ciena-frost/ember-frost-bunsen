import Ember from 'ember'
const {Router: EmberRouter} = Ember

import config from './config/environment'

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function () {
  this.route('component', {path: '/components'}, function () {
    this.route('detail')
    this.route('form')
    this.route('abstract-input')
  })

  this.route('editor')

  this.route('examples')

  this.route('model', function () {
    this.route('formats')
    this.route('types')
  })

  this.route('tutorial', {path: 'tutorial/:slug'})

  this.route('view', function () {
    this.route('renderers')
  })
})

export default Router
