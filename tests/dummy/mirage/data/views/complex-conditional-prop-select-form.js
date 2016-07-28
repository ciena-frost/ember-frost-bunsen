export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      label: 'Main',
      extends: 'main'
    }
  ],
  cellDefinitions: {
    main: {
      children: [
        {
          model: 'tags',
          arrayOptions: {
            itemCell: {
              label: 'Tags',
              extends: 'tags'
            }
          }
        }
      ]
    },
    tags: {
      children: [
        {
          model: 'tagType'
        },
        {
          model: 'tag'
        },
        {
          model: 'tag2'
        }
      ]
    }
  }
}
