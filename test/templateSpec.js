/* globals describe, it */

'use strict'

const assert = require('chai').assert
const template = require('../template')

describe('template', () => {
  describe('#tab', () => {
    it('should create a tab', () => {
      var tab = template.tab({
        val: template.tabVal.start,
        pos: 700,
        leader: template.tabLeader.none
      })

      assert.equal(tab.render(),
        '<w:tab w:val="start" w:pos="700" w:leader="none"/>')
    })
  })

  describe('#tabs', () => {
    it('should create tabs', () => {
      var tabs = template.tabs([
        {
          val: template.tabVal.end,
          pos: 700,
          leader: template.tabLeader.none
        },
        {
          val: template.tabVal.start,
          pos: 850,
          leader: template.tabLeader.none
        }
      ])

      assert.equal(tabs.render(),
        '<w:tabs>' +
        '<w:tab w:val="end" w:pos="700" w:leader="none"/>' +
        '<w:tab w:val="start" w:pos="850" w:leader="none"/>' +
        '</w:tabs>')
    })
  })

  describe('#indentation', () => {
    it('should create indentation', () => {
      var ind = template.indentation({
        start: 500,
        end: 500,
        hanging: 500
      })

      assert.equal(ind.render(),
        '<w:ind w:start="500" w:end="500" w:hanging="500"/>')
    })
  })

  describe('#spacing', () => {
    it('should create spacing', () => {
      var sp = template.spacing({
        before: 100,
        after: 100
      })

      assert.equal(sp.render(), '<w:spacing w:before="100" w:after="100"/>')
    })
  })

  describe('#style', () => {
    it('should create style', () => {
      var style = template.style({
        color: '000000',
        size: 20,
        bold: true
      })

      assert.equal(style.render(),
        '<w:rPr><w:sz w:val="20"/><w:color w:val="000000"/><w:b/></w:rPr>')
    })
  })

  describe('#text', () => {
    it('should create text', () => {
      var text = template.text('hello')
      assert.equal(text.render(), '<w:r><w:t>hello</w:t></w:r>')
    })

    it('should create text with style', () => {
      var text = template.text('hello', {
        color: '0000FF'
      }, true)

      assert.equal(text.render(),
        '<w:r>' +
        '<w:rPr><w:color w:val="0000FF"/></w:rPr>' +
        '<w:t xml:space="preserve">hello</w:t>' +
        '</w:r>')
    })
  })

  describe('#link', () => {
    it('should create a link structure', () => {
      var link = template.link('example', 'https://www.example.com/', {
        underline: true,
        color: '0000FF'
      })

      assert.equal(link.length, 5)
      assert.equal(link[0].getChild(0).getTagName(), 'w:fldChar')
      assert.equal(link[1].getChild(0).getTagName(), 'w:instrText')
    })
  })
})
