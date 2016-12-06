import {changeUtils} from 'bunsen-core'
const {getChangeSet} = changeUtils

export function addChangeSet (component) {
  const value = component.get('value')
  const cellConfig = component.get('cellConfig')
  const bunsenId = component.get('bunsenId')
  let bunsenIdHash = bunsenId ? `${bunsenId}.${cellConfig.model}` : cellConfig.model
  bunsenIdHash = ('root.' + bunsenIdHash).replace(/\.\d+/g, '.[]')

  cellConfig.__dependency__ = bunsenIdHash
  cellConfig.__bunsenId__ = bunsenIdHash

  component.set('valueChangeSet', getChangeSet({}, value))
}
