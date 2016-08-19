import customFormatTests from './common'

const invalidValues = [
  'test',
  '0.5',
  '-1',
  '256'
]

const validValues = [
  '0',
  '255'
]

customFormatTests('uint8', invalidValues, validValues)
