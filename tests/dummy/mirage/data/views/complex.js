export default {
  version: '2.0',
  type: 'form',
  cells: [{label: 'Flat', extends: 'flat'}],
  cellDefinitions: {
    flat: {
      children: [
        {model: 'network.host.name', label: 'Host name'},
        {
          model: 'network.host.interfaces',
          label: 'Host interfaces',
          arrayOptions: {
            itemCell: {
              extends: 'interface'
            }
          }
        },
        {model: 'network.firewall.name', label: 'Firewall name'},
        {
          model: 'network.firewall.interfaces',
          label: 'Firewall Interfaces',
          arrayOptions: {
            itemCell: {
              extends: 'interface'
            }
          }
        }
      ]
    },
    interface: {
      children: [
        {model: 'name'},
        {model: 'adminState'}
      ]
    },
    networkElement: {
      children: [
        {model: 'name'},
        {model: 'interfaces', extends: 'interface'}
      ]
    }
  }
}
