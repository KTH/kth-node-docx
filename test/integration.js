'use strict'

var fs = require('fs')
var data = require('./data')
var docx = require('../index')
var tmpl = docx.template

var header1 = text => {
  return tmpl
    .paragraph({
      keepLines: true,
      keepNext: true,
      spacing: {
        before: 480,
        after: 240,
      },
    })
    .append(
      tmpl.text(text, {
        bold: true,
        color: '003f5f',
        size: 36,
      })
    )
    .render()
}

var header2 = text => {
  return tmpl
    .paragraph({
      keepLines: true,
      keepNext: true,
      spacing: {
        before: 240,
        after: 120,
      },
    })
    .append(
      tmpl.text(text, {
        bold: true,
        color: '006f8f',
        size: 30,
      })
    )
    .render()
}

var tab = () => tmpl.run(tmpl.tab())

var reference = pub => {
  return tmpl
    .paragraph({
      keepLines: true,
      spacing: {
        after: 120,
      },
      indentation: {
        start: 850,
        hanging: 850,
      },
      tabs: [
        { pos: 700, val: tmpl.tabVal.end },
        { pos: 850, val: tmpl.tabVal.start },
      ],
    })
    .appendAll([
      tab(),
      tmpl.text(`[${pub.index}]`),
      tab(),
      tmpl.text(pub.authors),
      tmpl.text(pub.etAl, { italic: true }, true),
    ])
    .appendAll(
      tmpl.link(pub.description, pub.link, {
        color: '0000ff',
        underline: true,
      })
    )
    .appendAll([tmpl.text(pub.from), tmpl.text(pub.title, { italic: true }, true), tmpl.text(pub.details)])
    .render()
}

var xml = data.reduce((out, x) => {
  out += header1(x.title)

  out += x.list.reduce((out1, y) => {
    out1 += header2(y.title)

    out1 += y.list.reduce((out2, z) => {
      return out2 + reference(z)
    }, '')

    return out1
  }, '')

  return out
}, '')

fs.readFile(__dirname + '/xml.docx', 'binary', (err, template) => {
  if (err) {
    console.error(err)
    return
  }

  var doc = docx.generate(xml, template, 'publications')

  fs.writeFile(__dirname + '/out.docx', doc, err => {
    if (err) {
      console.log(err)
    }
  })
})
