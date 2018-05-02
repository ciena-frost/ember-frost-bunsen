## autocomplete

This renderer provides an autocomplete input which suggests options to be selected. This renderer is meant to be an alternative to select.
This has a look and feel very familiar with typical autocomplete. However, like select, this requires an option to be selected. This is because both select and autocomplete require a label and value (which typically is some internal id). This isn't just a free form text input where the selections are optional, an item must be selected.

Here is an example of what this isn't ideal for (at least the current iteration of autocomplete):

Searching for a name for your pet. Perhaps this pet will get a name never been given before. This new never been used name most likely isn't an option in the dropdown and therefore could not be used with this renderer.

What this is ideal for:

Your home is incredibly sophisticated and you are trying to locate your pet. Type in the pet's name into the locator, select the pet item, and run the locate function on your pet.

The API is identical to Select. Except for the following:
<ul>
  <li>There is no multi-select.</li>
  <li>There is no default selection of an index (no starting with item #3 in the dropdown).</li>
</ul>

Please refer to 
<a href="/#/view/renderers?renderer=select">Select Renderer</a>
for documentation

Due to the behavior of this renderer, the label (the part the user sees) and the value (internal id) are disconnected. Like select, a selectedValue (of a string) can be configured for it's initial value.
Unlike select though, this will be internal only and will not produce a label.

To specify a starting label, the following spread option should be used:

```js
{
  model: 'foo',
  renderer: {
    name: 'autocomplete',
    options: {
      debounceInterval: 300,
      filter: 'Gadnuk',
      selectedValue: 'pet_5'
    }
  }
}
```