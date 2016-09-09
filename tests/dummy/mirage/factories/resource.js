import {Factory, faker} from 'ember-cli-mirage'

export default Factory.extend({
  id (index) { return index },
  label: faker.random.word,
  type: 'resource'
})
