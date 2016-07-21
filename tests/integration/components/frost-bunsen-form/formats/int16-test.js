import customFormatTests from './common'

const invalidValues = [
  'test',
  '0.5',
  '-32769',
  '32768'
]

const validValues = [
  '-32768',
  '32767'
]

customFormatTests('int16', invalidValues, validValues)
