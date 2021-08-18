const factory = require('./element')

// http://officeopenxml.com/anatomyofOOXML.php
module.exports = {
  p: factory({
    tagName: 'w:p',
    validChildren: ['w:r', 'w:pPr'],
  }),
  pPr: factory({
    tagName: 'w:pPr',
    validChildren: ['w:keepLines', 'w:keepNext', 'w:tabs', 'w:spacing', 'w:ind', 'w:rPr'],
  }),
  r: factory({
    tagName: 'w:r',
    validChildren: ['w:t', 'w:rPr', 'w:tab', 'w:fldChar', 'w:instrText'],
  }),
  t: factory({
    tagName: 'w:t',
    validAttributes: ['xml:space'],
  }),
  rPr: factory({
    tagName: 'w:rPr',
    validChildren: ['w:b', 'w:i', 'w:u', 'w:sz', 'w:color', 'w:rFonts'],
  }),
  keepLines: factory({
    tagName: 'w:keepLines',
  }),
  keepNext: factory({
    tagName: 'w:keepNext',
  }),
  tabs: factory({
    tagName: 'w:tabs',
    validChildren: ['w:tab'],
  }),
  spacing: factory({
    tagName: 'w:spacing',
    validAttributes: ['w:before', 'w:after'],
  }),
  ind: factory({
    tagName: 'w:ind',
    validAttributes: ['w:start', 'w:end', 'w:hanging', 'w:firstLine'],
  }),
  tab: factory({
    tagName: 'w:tab',
    validAttributes: ['w:val', 'w:pos', 'w:leader'],
  }),
  sz: factory({
    tagName: 'w:sz',
    validAttributes: ['w:val'],
  }),
  b: factory({
    tagName: 'w:b',
  }),
  i: factory({
    tagName: 'w:i',
  }),
  u: factory({
    tagName: 'w:u',
    validAttributes: ['w:val', 'w:color'],
  }),
  fldChar: factory({
    tagName: 'w:fldChar',
    validAttributes: ['w:fldCharType'],
  }),
  instrText: factory({
    tagName: 'w:instrText',
    validAttributes: ['xml:space'],
  }),
  rFonts: factory({
    tagName: 'w:rFonts',
    validAttributes: ['w:ascii', 'w:cs', 'w:hAnsi', 'w:eastAsia'],
  }),
  color: factory({
    tagName: 'w:color',
    validAttributes: ['w:val'],
  }),
}
