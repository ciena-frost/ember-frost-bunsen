import customFormatTests from './common'

const invalidValues = [
  'a',
  '0.5',
  '1',

  // value does not consist of four octets
  '100.101.102',

  // octets contain non-numeric characters
  '100a.101.102.103',
  '100.101a.102.103',
  '100.101.102a.103',
  '100.101.102.103a',

  // octets contain negative numbers
  '-100.101.102.103',
  '100.-101.102.103',
  '100.101.-102.103',
  '100.101.102.-103',

  // octets contain numbers > 255
  '256.101.102.103',
  '100.256.102.103',
  '100.101.256.103',
  '100.101.102.256',

  // invalid netmask
  '127.0.0.1',
  '255.255.255.144'
]

const validValues = [
  '0.0.0.0',
  '255.255.255.0',
  '255.255.255.128',
  '255.255.255.255'
]

customFormatTests('netmask', invalidValues, validValues)
