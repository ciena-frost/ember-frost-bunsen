import Ember from 'ember'
const {run} = Ember
import Application from '../../app'
import config from '../../config/environment'

const assign = Ember.assign || Object.assign || Ember.merge

export default function startApp (attrs) {
  let application

  let attributes = assign({}, config.APP)
  attributes = assign(attributes, attrs) // use defaults, but you can override

  run(() => {
    application = Application.create(attributes)
    application.setupForTesting()
    application.injectTestHelpers()
  })

  return application
}
