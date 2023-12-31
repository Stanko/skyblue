# SkyBlue v2

Work in progress.

## TODO

- Typography
  - Titles
  - Paragraphs
  - Links
  - Lists
  - Blockquotes
  - Tables
  - Code
  - Images
- Forms
  - Buttons
  - Inputs
  - Textareas
  - Checkboxes
  - Radio Buttons
  - Selects
  - File Uploads
  - Range
- Icons (?)
- Layout
  - Grid
- Helpers
  - Colors
  - Margins - scale (?)
  - Paddings
  - ...
- Themes

## Notes

- [ ] Generate colors using [HSLuv](https://www.hsluv.org/)

  Snippet to drop into the console:

  ```js
  var $lightness = document.querySelector('.counter-lightness');
  var $hex = document.querySelector('.input-hex');
  var lightness = [95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5];
  var values = lightness.map((l) => {
    $lightness.value = l;
    $lightness.dispatchEvent(new Event('input'));
    return `--main-${(100 - l) * 10}: ${$hex.value};`;
  });
  values.join('\n');
  ```

- [x] Checkbox - indeterminate state
- [ ] Dialog - document that in order to close it on overlay click, there needs to be a wrapper div
- [ ] Dialog - optional animations
