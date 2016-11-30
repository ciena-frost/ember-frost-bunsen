import customFormatTests from './common'

const invalidValues = [
  'a',
  '1',
  '0.5',

  // network mask is missing
  '100.101.102.103',

  // ip address does not consist of four octets
  '100.101.102/0',

  // octets contain non-numeric characters
  '100a.101.102.103/0',
  '100.101a.102.103/0',
  '100.101.102a.103/0',
  '100.101.102.103a/0',

  // octets contain negative numbers
  '-100.101.102.103/0',
  '100.-101.102.103/0',
  '100.101.-102.103/0',
  '100.101.102.-103/0',

  // octets contain numbers > 255
  '256.101.102.103/0',
  '100.256.102.103/0',
  '100.101.256.103/0',
  '100.101.102.256/0',

  // first octet contains numbers > 253
  '254.0.0.0/0',
  '255.0.0.0/0',

  // invalid IPv4 interface
  '192.168.0.0/16',
  '192.168.255.255/16'
]

const validValues = [
  '192.168.128.0/16',
  '192.168.0.1/16'
]

customFormatTests('ipv4-interface', invalidValues, validValues)
