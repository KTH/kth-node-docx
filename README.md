__⚠️ Archived at 2023-09-12, since none of our apps is currently using it. ⚠️__

# docx generator

Given a `docx` file with the following content:

```
{@publications}
```

And an XML string generated with the `template` and/or `docx` helpers:

```xml
<w:p><w:r><w:t>hello world</w:t></w:r></w:p>
```

## Code usage

```javascript
var fs = require('fs')
var docx = require('@kth/kth-node-docx')
var xml = '<w:p><w:r><w:t>hello world</w:t></w:r></w:p>'
var templateBuffer = fs.readFileSync('template.docx', 'binary')
var outputBuffer = docx.generate(xml, templateBuffer, 'publications')
fs.writeFileSync('publications.docx', outputBuffer)
```

For an example of how to use the XML helpers, see the
`test/integration.js` file.
