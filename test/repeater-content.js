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

    it('no repeat', () => {
        assert.equal(expand('ul>li', ['foo', 'bar']), '<ul><li>foo\nbar</li></ul>');
        assert.equal(expand('ul>li', 'foo'), '<ul><li>foo</li></ul>');
    });

    it('output placeholder', () => {
        assert.equal(expand('ul>li[class=$#]*', ['foo', 'bar']), '<ul><li class="foo"></li><li class="bar"></li></ul>');
        assert.equal(expand('ul>li[class=$#]*{content: $#}', ['foo', 'bar']), '<ul><li class="foo">content: foo</li><li class="bar">content: bar</li></ul>');
        assert.equal(expand('ul>li[class=$#]*>a+b{content: $#}', ['foo', 'bar']), '<ul><li class="foo"><a></a><b>content: foo</b></li><li class="bar"><a></a><b>content: bar</b></li></ul>');
        assert.equal(expand('ul>li*>a+b{content: $#}', ['foo', 'bar']), '<ul><li><a></a><b>content: foo</b></li><li><a></a><b>content: bar</b></li></ul>');
    });

    it('URL patterns', () => {
        assert.equal(expand('p*>a', ['http://emmet.io', 'https://livestyle.io']), '<p><a href="http://emmet.io">http://emmet.io</a></p><p><a href="https://livestyle.io">https://livestyle.io</a></p>');
        assert.equal(expand('p*>a', ['emmet.io/foo', 'livestyle.io/bar/baz/']), '<p><a href="http://emmet.io/foo">emmet.io/foo</a></p><p><a href="http://livestyle.io/bar/baz/">livestyle.io/bar/baz/</a></p>');
        assert.equal(expand('p*>a', 'info@emmet.io'), '<p><a href="mailto:info@emmet.io">info@emmet.io</a></p>');
    });
});
