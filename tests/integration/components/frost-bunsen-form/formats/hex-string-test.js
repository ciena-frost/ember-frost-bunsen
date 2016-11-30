import customFormatTests from './common'

const invalidValues = [
  'a',
  '1',
  '0.5',
  'a1:',
  'a1:b',
  'g1'
]

const validValues = [
  'a1',
  'a1:b2',
  'f1'
]

customFormatTests('hex-string', invalidValues, validValues)
