'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const insert = require('../lib/repeater-content').default;
const stringify = require('./assets/stringify').default;

describe('Repeater content', () => {
	const expand = (abbr, content) => stringify( insert(parse(abbr), content) );

	it('implicit repeat', () => {
		assert.equal(expand('ul>li*', ['foo', 'bar']), '<ul><li*2@1>foo</li><li*2@2>bar</li></ul>');
	});
});
