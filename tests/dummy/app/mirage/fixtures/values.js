export default [
  {
    id: 'l3vpn-filled-out',
    label: 'Filled Out',
    modelIds: ['l3vpn', 'l3vpn-defaults'],
    value: {
      desiredOrchState: '',
      discovered: false,
      label: 'North-East-L3VPN',
      productId: '234-89ENLSLIEB-389LSE8-383H-39Y1',
      properties: {
        'customer-name': 'Verizon',
        description: 'North Bay to East Bay',
        endpoints: [
          {
            attachment: {
              connection: {
                ipv4: {
                  'subnet-prefix': ''
                },
                'routing-protocols': [
                  {
                    bgp: {
                      'address-family': '',
                      'as-number': '',
                      'route-distinguisher': '',
                      vrf: ''
                    },
                    type: ''
                  }
                ]
              }
            },
            extension: {
              interface: {
                address: '125.23.16.148',
                dot1q: '600',
                name: 'Stuff',
                'second-dot1q': '600'
              },
              vrf: {
                'address-family': [
                  {
                    af: {
                      export: {
                        'route-target': '65000:1'
                      },
                      import: {
                        'route-target': '65000:1'
                      }
                    },
                    type: 'bgp'
                  }
                ],
                name: 'IvP4'
              }
            },
            nodeId: 'North-123',
            nodeTypeGroup: 'Ciena 6500'
          }
        ],
        name: '',
        service: {
          'svc-bandwidth': '5000000'
        }
      }
    }
  }
]
