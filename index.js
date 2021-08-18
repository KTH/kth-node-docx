'use strict'

const DocxTemplater = require('docxtemplater')
const JSZip = require('jszip/lib')
const docx = require('./docx')
const template = require('./template')

module.exports = {
  /**
   * Direct access to underlying OOXML API
   */
  docx,

  /**
   * Template helpers
   */
  template,

  /**
   * Generates a new DOCX from supplied XML and buffer
   * @param {String} xml - OOXML string {@link http://officeopenxml.com/}
   * @param {*} buffer - binary buffer of a docx file
   * @param {String} [key] - template XML key
   *    {@link https://github.com/open-xml-templating/docxtemplater}
   * @returns {*|String|Uint8Array|ArrayBuffer|Buffer|Blob}
   */
  generate(xml, buffer, key) {
    const zip = new JSZip(buffer)
    const doc = new DocxTemplater().loadZip(zip)
    const data = {}
    data[key || 'xml'] = xml
    doc.setData(data)
    doc.render()
    return doc.getZip().generate({ type: 'nodebuffer' })
  },
}
