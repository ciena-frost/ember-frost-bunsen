## image

This renders an image using the value of the property it is used for as the image's
URL.

### Properties

#### label

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "name": "image"
  }
}
```

#### renderer.alt

> This attribute defines the alternative text describing the image. Users will
> see this text displayed if the image URL is wrong, the image is not in one of
> the supported formats, or if the image is not yet downloaded.
>
> [taken from MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)

```json
{
  "label": "Bar",
  "model": "foo",
  "renderer": {
    "alt": "Puppies!",
    "name": "image"
  }
}
```

#### renderer.src

Change the `src` attribute of the underlying image tag. By default the value of
the property in the form will be used. This option is useful when you want to
have a hard-coded image in your bunsen view.

```json
{
  "model": "label",
  "renderer": {
    "name": "image",
    "src": "https://placeholdit.imgix.net/~text?txtsize=20&txt=100%C3%97100&w=100&h=100"
  }
}
```

You can also generate a `src` that contains information from other form property
values by using the template string format. For example given the following
model:

```json
{
  "type": "object",
  "properties": {
    "foo": {
      "type": "object",
      "properties": {
        "height": {"type": "string"},
        "width": {"type": "string"}
      }
    }
  }
}
```

You could do:

```json
{
  "model": "foo.width",
  "renderer": {
    "name": "image",
    "src": "https://placeholdit.imgix.net/~text?txtsize=20&txt=${./width}%C3%97${./height}&w=${./width}&h=${./height}"
  }
}
```
