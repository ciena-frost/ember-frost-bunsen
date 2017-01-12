export default {
  cells: [
    {
      children: [
        {
          model: 'foo',
          renderer: {
            alt: 'Placeholder',
            name: 'image'
          }
        },
        {
          model: 'foo',
          renderer: {
            alt: '${./w} x ${./h} placeholder',
            name: 'image',
            src: 'https://placeholdit.imgix.net/~text?txtsize=20&txt=${./w}%C3%97${./h}&w=${./w}&h=${./h}'
          }
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}
