import Ember from 'ember'
import config from './config/environment'

var Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function () {
  this.route('component', {path: '/components'}, function () {
    this.route('detail')
    this.route('form')
  })

  this.route('editor')

  this.route('examples')

  this.route('model', function () {
    this.route('formats')
  })

  this.route('tutorial', {path: 'tutorial/:slug'})

  this.route('view', function () {
    this.route('renderers')
  })
})

export default Router
