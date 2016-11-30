import customFormatTests from './common'

const invalidValues = [
  'a',
  '1',
  '0.5',

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
  '100.101.102.256'
]

const validValues = [
  '0.0.0.0',
  '127.0.0.1',
  '255.255.255.255'
]

customFormatTests('ipv4-address', invalidValues, validValues)
