import bgpAs from './bgp-as'
import date from './date'
import hexString from './hex-string'
import int16 from './int16'
import int32 from './int32'
import int64 from './int64'
import int8 from './int8'
import ipAddress from './ip-address'
import ipv4Address from './ipv4-address'
import ipv4Interface from './ipv4-interface'
import ipv4Prefix from './ipv4-prefix'
import ipv6Address from './ipv6-address'
import ipv6Interface from './ipv6-interface'
import ipv6Multicast from './ipv6-multicast'
import ipv6Prefix from './ipv6-prefix'
import netmask from './netmask'
import portNumber from './port-number'
import time from './time'
import uint16 from './uint16'
import uint32 from './uint32'
import uint8 from './uint8'
import url from './url'
import vlanId from './vlan-id'

export default {
  'bgp-as': bgpAs,
  date,
  'hex-string': hexString,
  int8,
  int16,
  int32,
  int64,
  'ip-address': ipAddress,
  'ipv4-address': ipv4Address,
  'ipv4-interface': ipv4Interface,
  'ipv4-prefix': ipv4Prefix,
  'ipv6-address': ipv6Address,
  'ipv6-interface': ipv6Interface,
  'ipv6-multicast': ipv6Multicast,
  'ipv6-prefix': ipv6Prefix,
  netmask,
  'port-number': portNumber,
  time,
  uint8,
  uint16,
  uint32,
  url,
  'vlan-id': vlanId
}
