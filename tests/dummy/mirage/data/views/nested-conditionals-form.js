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
          model: 'tagType'
        },
        {
          model: 'myTags.tag'
        },
        {
          model: 'myTags.tag2'
        }
      ]
    }
  }
}
