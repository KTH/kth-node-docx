'use strict'

const R = require('ramda')
const docx = require('./docx')

function _isNonEmpty(obj) {
  return !!obj && !R.isEmpty(obj)
}

const template = {
  /**
   * Font style object
   * @typedef {Object} Style
   * @property {String} [family] - font family
   * @property {Number} [size] - font size
   * @property {String} [color] - font color in RGB hex format
   * @property {Boolean} [bold] - make text appear bold
   * @property {Boolean} [italic] - make text appear italic
   * @property {Boolean} [underline] - apply underline to text
   */

  /**
   * Spacing configuration
   * @typedef {Object} Spacing
   * @property {Number} [before] - spacing before
   * @property {Number} [after] - spacing after
   */

  /**
   * Indentation configuration
   * @typedef {Object} Indentation
   * @property {Number} [start] - indentation start
   * @property {Number} [end] - indentation end
   * @property {Number} [hanging] - indentation hanging
   * @property {Number} [firstLine] - indentation firstLine
   */

  /**
   * Represents a tab object
   * @typedef {Object} Tab
   * @property {Number} pos - the position of the tab
   * @property {tabVal} [val] - the style of the tab
   * @property {tabLeader} [leader] - the tab filling
   */

  /**
   * Paragraph options
   * @typedef {Object} Paragraph
   * @property {Boolean} [keepLines] - try to keep lines on the same page
   * @property {Boolean} [keepNext] - try to keep this paragraph on the same
   *                                  page as the following paragraph
   * @property {Spacing} [spacing] - spacing options
   * @property {Indentation} [indentation] - indentation options
   * @property {Style} [style] - font style options
   * @property {Tab[]} [tabs] - tab configuration
   */

  /**
   * Tab styles
   * @readonly
   * @enum {String}
   */
  tabVal: {
    bar: 'bar',
    center: 'center',
    clear: 'clear',
    decimal: 'decimal',
    end: 'end',
    num: 'num',
    start: 'start',
  },

  /**
   * Tab fill
   * @readonly
   * @enum {String}
   */
  tabLeader: {
    dot: 'dot',
    heavy: 'heavy',
    hyphen: 'hyphen',
    middleDot: 'middleDot',
    none: 'none',
    underscore: 'underscore',
  },

  /**
   * Creates a run element with a child element
   * @param {Element} child - the child element to append
   * @returns {Element} a run element
   */
  run: function (child) {
    return docx.r().append(child)
  },

  /**
   * Generates a tab element to be place in a run element or a tabs element
   * @param {Object} [options] - tab options
   * @param {Number} options.pos - the position of the tab
   * @param {String} [options.val] - the style of the tab
   * @param {String} [options.leader] - the tab filling
   * @returns {Element} a tab element
   */
  tab: function (options) {
    var el = docx.tab()

    var defaults = {
      val: template.tabVal.start,
      pos: 0,
      leader: template.tabLeader.none,
    }

    if (!options) {
      return el
    }

    options = R.merge(defaults, options)

    el.attr('w:val', options.val)
    el.attr('w:pos', options.pos)
    el.attr('w:leader', options.leader)

    return el
  },

  /**
   * Creates a tabs element for use in paragraph property elements
   * @param {Tab[]} [tabs] - array of tabs
   * @returns {Element} a tabs element
   */
  tabs: function (tabs) {
    var el = docx.tabs()

    el.appendAll(R.map(template.tab, tabs || []))

    return el
  },

  /**
   * Creates an indentation element for use in paragraph property elements
   * @param {Indentation} [options] - indentation options
   * @returns {Element} an indentation element
   */
  indentation: function (options) {
    var el = docx.ind()

    var defaults = {
      start: 0,
      end: 0,
      hanging: 0,
      firstLine: 0,
    }

    options = R.merge(defaults, options || {})

    if (options.start) {
      el.attr('w:start', options.start)
    }

    if (options.end) {
      el.attr('w:end', options.end)
    }

    if (options.hanging) {
      el.attr('w:hanging', options.hanging)
    }

    if (options.firstLine && !options.hanging) {
      el.attr('w:firstLine', options.firstLine)
    }

    return el
  },

  /**
   * Creates a spacing element for use in paragraph property elements
   * @param {Spacing} [options] - spacing options
   * @returns {Element} a spacing element
   */
  spacing: function (options) {
    var el = docx.spacing()

    var defaults = {
      before: 0,
      after: 0,
    }

    options = R.merge(defaults, options || {})

    el.attr('w:before', options.before)
    el.attr('w:after', options.after)

    return el
  },

  /**
   * Creates a run property element for use in run elements
   * @param {Style} [options] - style options
   * @returns {Element} a run property element
   */
  style: function (options) {
    var el = docx.rPr()

    var defaults = {
      family: '',
      size: 0,
      color: '',
      bold: false,
      italic: false,
      underline: false,
    }

    options = R.merge(defaults, options || {})

    if (options.family) {
      el.append(template.font(options.family))
    }

    if (options.size) {
      el.append(template.size(options.size))
    }

    if (options.color) {
      el.append(template.color(options.color))
    }

    if (options.bold) {
      el.append(docx.b())
    }

    if (options.italic) {
      el.append(docx.i())
    }

    if (options.underline) {
      el.append(docx.u().attr('w:val', 'single'))
    }

    return el
  },

  /**
   * Creates a paragraph element
   * @param {Paragraph} [options] - paragraph options
   * @returns {Element} a paragraph element
   */
  paragraph: function (options) {
    var prop = docx.pPr()
    var el = docx.p().append(prop)

    var defaults = {
      keepLines: false,
      keepNext: false,
      indentation: {},
      spacing: {},
      style: {},
      tabs: [],
    }

    options = R.merge(defaults, options || {})

    if (_isNonEmpty(options.style)) {
      prop.append(template.style(options.style))
    }

    if (_isNonEmpty(options.spacing)) {
      prop.append(template.spacing(options.spacing))
    }

    if (_isNonEmpty(options.indentation)) {
      prop.append(template.indentation(options.indentation))
    }

    if (_isNonEmpty(options.tabs)) {
      prop.append(template.tabs(options.tabs))
    }

    if (options.keepLines) {
      prop.append(docx.keepLines())
    }

    if (options.keepNext) {
      prop.append(docx.keepNext())
    }

    return el
  },

  /**
   * Creates a text element inside a run element
   * @param {String} text - text
   * @param {Style} [style] - font style
   * @param {Boolean} [preserve=false] - set to true to preserve whitespace
   * @returns {Element} a docx r element with text
   */
  text: function (text, style, preserve) {
    var run = docx.r()
    var t = docx.t(text)

    if (_isNonEmpty(style)) {
      run.append(template.style(style))
    }

    if (preserve) {
      t.attr('xml:space', 'preserve')
    }

    run.append(t)

    return run
  },

  /**
   * Generates a docx color for use in run properties (rPr)
   * @param {String} color - color in hex format
   * @returns {Element} a docx color element
   */
  color: function (color) {
    return docx.color().attr('w:val', color)
  },

  /**
   * Generates a font element for use in run properties (rPr)
   * @param {String} font - font family
   * @returns {Element} a docx rFont element
   */
  font: function (font) {
    return docx.rFonts().attr('w:cs', font).attr('w:ascii', font).attr('w:hAnsi', font)
  },

  /**
   * Generates a size element for use in run properties (rPr)
   * @param size {Number} font size
   * @returns {Element} an sz element
   */
  size: function (size) {
    return docx.sz().attr('w:val', size)
  },

  /**
   * Generates a start fldChar for creating a link
   * @returns {Element} an r element with a fldChar element of type begin
   */
  fldBegin: function () {
    return docx.r().append(docx.fldChar().attr('w:fldCharType', 'begin'))
  },

  /**
   * Generates a separate fldChar for creating a link
   * @returns {Element} an r element with a fldChar element of type separate
   */
  fldSeparate: function () {
    return docx.r().append(docx.fldChar().attr('w:fldCharType', 'separate'))
  },

  /**
   * Generates an end fldChar for creating a link
   * @returns {Element} an r element with a fldChar element of type end
   */
  fldEnd: function () {
    return docx.r().append(docx.fldChar().attr('w:fldCharType', 'end'))
  },

  /**
   * Generates an instrText element for creating a link
   * @param {String} url - an XML escaped URL
   * @returns {Element} a docx r element with an instrText element
   */
  hyperlink: function (url) {
    return docx.r().append(docx.instrText(`HYPERLINK &quot;${url}&quot; `).attr('xml:space', 'preserve'))
  },

  /**
   * Generates an element array for an inline link
   * @param {String} text - link text
   * @param {String} url - link url
   * @param {Style} [style] - link style
   * @returns {Element[]} an array of elements that,
   *                      when rendered, displays a link
   */
  link: function (text, url, style) {
    return [
      template.fldBegin(),
      template.hyperlink(url),
      template.fldSeparate(),
      template.text(text, style, true),
      template.fldEnd(),
    ]
  },
}

module.exports = template
