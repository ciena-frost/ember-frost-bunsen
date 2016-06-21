import Ember from 'ember'
const {assign, run} = Ember
import Application from '../../app'
import config from '../../config/environment'

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
