'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const numbering = require('../lib/numbering').default;
const stringify = require('./assets/stringify').default;

describe('Item numbering', () => {
	const expand = abbr => stringify( numbering(parse(abbr)), {skipRepeat: true, omitGroups: true});

	it('apply numbering', () => {
		// skip elements without explicit repeater
		assert.equal(expand('h$'), '<h$></h$>');
		assert.equal(expand('h$.item$'), '<h$ class="item$"></h$>');

		assert.equal(expand('h$.item$*3'), '<h1 class="item1"></h1><h2 class="item2"></h2><h3 class="item3"></h3>');
		assert.equal(expand('h$.item${text $$$}*3'), '<h1 class="item1">text 001</h1><h2 class="item2">text 002</h2><h3 class="item3">text 003</h3>');
		assert.equal(expand('h$*3>b$'), '<h1><b1></b1></h1><h2><b2></b2></h2><h3><b3></b3></h3>');

		assert.equal(expand('ul#nav>li.item$*3'), '<ul id="nav"><li class="item1"></li><li class="item2"></li><li class="item3"></li></ul>');
		assert.equal(expand('ul#nav>li.item$$$*3'), '<ul id="nav"><li class="item001"></li><li class="item002"></li><li class="item003"></li></ul>');
		assert.equal(expand('ul#nav>li.$$item$$$*3'), '<ul id="nav"><li class="01item001"></li><li class="02item002"></li><li class="03item003"></li></ul>');
		assert.equal(expand('ul#nav>li.pre$*3+li.post$*3'), '<ul id="nav"><li class="pre1"></li><li class="pre2"></li><li class="pre3"></li><li class="post1"></li><li class="post2"></li><li class="post3"></li></ul>');
		assert.equal(expand('div.sample$*3'), '<div class="sample1"></div><div class="sample2"></div><div class="sample3"></div>');
		assert.equal(expand('ul#nav>li{text}*3'), '<ul id="nav"><li>text</li><li>text</li><li>text</li></ul>');
	});

    it('numbering from groups', () => {
        assert.equal(expand('(span.i$)*3'), '<span class="i1"></span><span class="i2"></span><span class="i3"></span>');
		assert.equal(expand('p.p$*2>(i.i$+b.b$)*3'), '<p class="p1"><i class="i1"></i><b class="b1"></b><i class="i2"></i><b class="b2"></b><i class="i3"></i><b class="b3"></b></p><p class="p2"><i class="i1"></i><b class="b1"></b><i class="i2"></i><b class="b2"></b><i class="i3"></i><b class="b3"></b></p>');
		assert.equal(expand('(p.i$+ul>li.i$*2>span.s$)*3'), '<p class="i1"></p><ul><li class="i1"><span class="s1"></span></li><li class="i2"><span class="s2"></span></li></ul><p class="i2"></p><ul><li class="i1"><span class="s1"></span></li><li class="i2"><span class="s2"></span></li></ul><p class="i3"></p><ul><li class="i1"><span class="s1"></span></li><li class="i2"><span class="s2"></span></li></ul>');
    });

	it('skip repeater replace', () => {
		assert.equal(expand('span[class=item\\$]*2'), '<span class="item$"></span><span class="item$"></span>');
		assert.equal(expand('span{item \\$}*2'), '<span>item $</span><span>item $</span>');
	});

	it('preserve attribute options', () => {
		const tree = numbering(parse('[!foo="bar$"]*2'));
		assert(tree.firstChild.getAttribute('foo').options.implied);
	});
});
