import customFormatTests from './common'

const invalidValues = [
  'test',
  '0.5',
  '-1',
  '0',
  '4095'
]

const validValues = [
  '1',
  '4094'
]

customFormatTests('vlan-id', invalidValues, validValues)
