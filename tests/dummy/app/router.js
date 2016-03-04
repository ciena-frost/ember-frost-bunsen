import Ember from 'ember'
import config from './config/environment'

const Router = Ember.Router.extend({
  location: config.locationType
})

Router.map(function () {
  this.route('detail')
  this.route('form')
  this.route('detail-update')
})

export default Router
