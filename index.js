'use strict'

const DocxTemplater = require('docxtemplater')
const docx = require('./docx')
const template = require('./template')

module.exports = {
  /**
   * Direct access to underlying OOXML API
   */
  docx: docx,

  /**
   * Template helpers
   */
  template: template,

  /**
   * Generates a new DOCX from supplied XML and buffer
   * @param {String} xml - OOXML string {@link http://officeopenxml.com/}
   * @param {*} buffer - binary buffer of a docx file
   * @param {String} [key] - template XML key
   *    {@link https://github.com/open-xml-templating/docxtemplater}
   * @returns {*|String|Uint8Array|ArrayBuffer|Buffer|Blob}
   */
  generate: function (xml, buffer, key) {
    const doc = new DocxTemplater(buffer)
    const data = {}
    data[key || 'xml'] = xml
    doc.setData(data)
    doc.render()
    return doc.getZip().generate({type: 'nodebuffer'})
  }
}
