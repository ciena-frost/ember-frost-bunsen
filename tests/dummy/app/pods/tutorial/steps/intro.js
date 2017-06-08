export default {
  component: 'markdown-step',
  props: {
    markdown: `
## What is it?

This Ember addon makes creating forms and detail views using [Frost](http://ciena-frost.github.io/)
require minimal programming. You simply create a JSON file defining your form value, which is often
the format of an API request body, and you optionally define another JSON file to control how your
UI looks. If you omit the latter \`ember-frost-bunsen\` will spit out a default view for you.

## Enough talk lets install this "thing".

\`\`\`bash
ember install ember-frost-bunsen
\`\`\`

## Okay I have this voodoo installed now how do I leverage it's magic?

The short answer is you consume one of its three components:

* \`frost-bunsen\`
* \`frost-bunsen-detail\`
* \`frost-bunsen-form\`

> Note: The component, \`frost-bunsen\`, will actually render a \`frost-bunsen-detail\` or a
\`frost-bunsen-form\` for you, depending on the view provided to your component instance. If
you don't provide a view it will always default to a form.

### Great, a component exists but I know nothing about it.

The menu on this documentation site outlines the components and what their API's look like.
In general though the next steps will be to learn how to create a model for a given view,
so we'll dive into that next. Throughout this tutorial/documentation you'll see a button
in the bottom right corner of your screen to move on to the next step and a button in the lower
left to go back to the previous step. Our next step will be talking about models so go ahead
and click the **Next** button in the bottom right of your screen.
`
  },
  slug: 'introduction',
  title: 'Introduction'
}
