export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      extends: 'main'
    }
  ],
  cellDefinitions: {
    main: {
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
