'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const insert = require('../lib/repeater-content').default;
const stringify = require('./assets/stringify').default;

describe('Repeater content', () => {
	const expand = (abbr, content) => stringify( insert(parse(abbr), content), {skipRepeat: true});

	it('implicit repeat', () => {
		assert.equal(expand('ul>li*', ['foo', 'bar']), '<ul><li>foo</li><li>bar</li></ul>');
		assert.equal(expand('ul>li*>a+b', ['foo', 'bar']), '<ul><li><a></a><b>foo</b></li><li><a></a><b>bar</b></li></ul>');
	});
});
