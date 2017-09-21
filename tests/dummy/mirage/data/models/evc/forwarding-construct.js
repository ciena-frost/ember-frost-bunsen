export default {
  title: 'Forwarding Construct',
  description: 'A TMForum TR225-compliant network construct',
  properties: {
    properties: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          title: 'Type',
          description: 'The type of the FC, e.g Link Connection, SNC',
          default: 'FDFR'
        },
        structure: {
          type: 'string',
          title: 'Structure',
          description: 'The structure of the FC, e.g p2p, multipoint, add-drop',
          default: 'P2P'
        }
      }
    }
  }
}
