'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const numbering = require('../lib/numbering').default;
const stringify = require('./assets/stringify').default;

describe('Item numbering', () => {
	const expand = abbr => stringify( numbering(parse(abbr)), {skipRepeat: true, omitGroups: true});

	it('apply numbering', () => {
		assert.equal(expand('h$'), '<h1></h1>');
		assert.equal(expand('h$.item$'), '<h1 class="item1"></h1>');
		assert.equal(expand('h$.item$*3'), '<h1 class="item1"></h1><h2 class="item2"></h2><h3 class="item3"></h3>');
		assert.equal(expand('h$.item${text $$$}*3'), '<h1 class="item1">text 001</h1><h2 class="item2">text 002</h2><h3 class="item3">text 003</h3>');

        assert.equal(expand('h$*3>b$'), '<h1><b1></b1></h1><h2><b2></b2></h2><h3><b3></b3></h3>');
	});

    it('numbering from groups', () => {
        assert.equal(expand('(span.i$)*3'), '<span class="i1"></span><span class="i2"></span><span class="i3"></span>');
		assert.equal(expand('p.p$*2>(i.i$+b.b$)*3'), '<p class="p1"><i class="i1"></i><b class="b1"></b><i class="i2"></i><b class="b2"></b><i class="i3"></i><b class="b3"></b></p><p class="p2"><i class="i1"></i><b class="b1"></b><i class="i2"></i><b class="b2"></b><i class="i3"></i><b class="b3"></b></p>');
		assert.equal(expand('(p.i$+ul>li.i$*2>span.s$)*3'), '<p class="i1"></p><ul><li class="i1"><span class="s1"></span></li><li class="i2"><span class="s2"></span></li></ul><p class="i2"></p><ul><li class="i1"><span class="s1"></span></li><li class="i2"><span class="s2"></span></li></ul><p class="i3"></p><ul><li class="i1"><span class="s1"></span></li><li class="i2"><span class="s2"></span></li></ul>');
    });
});
