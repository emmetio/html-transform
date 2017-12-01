'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const html = require('../index').default;
const stringify = require('./assets/stringify').default;

describe('HTML expand', () => {
	const expand = (abbr, content) => stringify( html(parse(abbr), content), {skipRepeat: true});

	it('apply transforms', () => {
		assert.equal(expand('ul>.item$*', ['foo$', 'bar$']), '<ul><li class="item1">foo$</li><li class="item2">bar$</li></ul>');
		assert.equal(expand('ul>[class=$#]{item $}*', ['foo$', 'bar$']), '<ul><li class="foo$">item 1</li><li class="bar$">item 2</li></ul>');
		assert.equal(expand('ul>.item$*'), '<ul><li class="item1"></li></ul>');
		assert.equal(expand('ul>.item$*', ['foo.bar', 'hello.world']), '<ul><li class="item1">foo.bar</li><li class="item2">hello.world</li></ul>');
	});

	it('apply addons', () => {
        // no addons
		assert.equal(expand('ul.nav>.-item*2'), '<ul class="nav"><li class="-item"></li><li class="-item"></li></ul>');

        // BEM addon
        assert.equal(expand('ul.nav>.-item*2', {bem: true}), '<ul class="nav"><li class="nav__item"></li><li class="nav__item"></li></ul>');

        // BEM addon with options
        assert.equal(expand('ul.nav>.-item*2', {bem: {element: '--'}}), '<ul class="nav"><li class="nav--item"></li><li class="nav--item"></li></ul>');
	});
});
