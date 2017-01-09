'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const xsl = require('../lib/addons/xsl').default;
const stringify = require('./assets/stringify').default;

describe('XSL transform', () => {
	const expand = abbr => stringify( xsl( parse(abbr) ) );

    it('transform', () => {
		assert.equal(expand('xsl:variable[select]'), '<xsl:variable select=""></xsl:variable>');
		assert.equal(expand('xsl:with-param[select]'), '<xsl:with-param select=""></xsl:with-param>');

		assert.equal(expand('xsl:variable[select]>div'), '<xsl:variable><div></div></xsl:variable>');
		assert.equal(expand('xsl:with-param[select]{foo}'), '<xsl:with-param>foo</xsl:with-param>');
    });
});
