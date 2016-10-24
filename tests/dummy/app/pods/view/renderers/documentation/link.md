## link

This renderer provides an anchor tag/link for a given address.

### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "link"
  }
}
```

#### renderer.label

Change what text is shown for the link. By default the value of the property in
the form will be used.

```json
{
  "model": "foo",
  "renderer": {
    "label": "Bar",
    "name": "link"
  }
}
```

You can also generate a label that contains information from other form property
values by using the template string format. For example given the following
model:

```json
{
  "type": "object",
  "properties": {
    "foo": {
      "type": "object",
      "properties": {
        "bar": {"type": "string"},
        "title": {"type": "string"}
      }
    }
  }
}
```

You could do:

```json
{
  "model": "foo.bar",
  "renderer": {
    "label": "${./title}",
    "name": "link"
  }
}
```

#### renderer.route

If the value of the property in the form is an identifier for a resource that
you want to you can set this property which will provide a link equivalent of
`{{link-to route value}}`, where *route* is the property defined in the view and
*value* is the value of the property in the form. For example the following
configuration in this documentation application would present a link to
`/#/tutorials/models` with the label `models` when the property value is
`models`.

```json
{
  "model": "tutorial",
  "renderer": {
    "name": "link",
    "route": "tutorial"
  }
}
```

#### renderer.url

Change what URL the link goes to. By default the value of the property in the
form will be used. This option is useful when you want the value of the property
in the form to drive the label.

```json
{
  "model": "label",
  "renderer": {
    "name": "link",
    "url": "http://ciena.com"
  }
}
```

You can also generate a URL that contains information from other form property
values by using the template string format. For example given the following
model:

```json
{
  "type": "object",
  "properties": {
    "foo": {
      "type": "object",
      "properties": {
        "bar": {"type": "string"},
        "protocol": {"type": "string"}
      }
    }
  }
}
```

You could do:

```json
{
  "model": "foo.bar",
  "renderer": {
    "name": "link",
    "url": "${./protocol}://ciena.com"
  }
}
```

> Note: if *route* is provided in the view that will take precedence over *url*.
