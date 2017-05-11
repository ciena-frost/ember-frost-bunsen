export default {
  component: 'markdown-step',
  props: {
    markdown: `
A bunsen model defines the JSON structure of the form value which often aligns with the structure for an API request.
This model is essentially [JSON schema](http://json-schema.org/) with some of our own additions.

> Note: we also omit a few features such as defining multiple types for a single property.

To get started you need this base template for your model:

\`\`\`json
{
  "properties": {
  },
  "type": "object"
}
\`\`\`

This tells bunsen our form value is an object. Next we'll actually want to define top level properties for our
form which can be any of the following types: **array**, **boolean**, **integer**, **number**, **object**, **string**.

Lets go ahead and start with a simple example of adding a string property named **foo**:

\`\`\`json
{
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "type": "object"
}
\`\`\`

Assuming the **foo** input was given the value **bar** our form value will look like:

\`\`\`json
{
  "foo": "bar"
}
\`\`\`

Next up we might want to make the **foo** input required which would yield the following model:

\`\`\`json
{
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "required": ["foo"],
  "type": "object"
}
\`\`\`

This covers the basics of a bunsen model and how it works, if you want to know more read up
on [JSON Schema](https://spacetelescope.github.io/understanding-json-schema/index.html).
    `
  },
  slug: 'models',
  title: 'Models'
}
