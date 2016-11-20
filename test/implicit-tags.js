'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const implicitTag = require('../lib/implicit-tags').default;
const tag = require('../lib/implicit-tags').resolveName;
const stringify = require('./assets/stringify').default;

describe('Implicit tags', () => {
    it('resolve name', () => {
        assert.equal(tag(), 'div');
        assert.equal(tag('foo'), 'div');
        assert.equal(tag('ul'), 'li');
        assert.equal(tag('p'), 'span');
        assert.equal(tag('b'), 'span');
    });

    it('update tree', () => {
        const expand = abbr => stringify( implicitTag( parse(abbr) ) );

        assert.equal(expand('.'), '<div class=""></div>');
        assert.equal(expand('.foo>.bar'), '<div class="foo"><div class="bar"></div></div>');
        assert.equal(expand('p.foo>.bar'), '<p class="foo"><span class="bar"></span></p>');
        assert.equal(expand('ul>.item*2'), '<ul><li*2@1 class="item"></li><li*2@2 class="item"></li></ul>');
        assert.equal(expand('table>.row>.cell'), '<table><tr class="row"><td class="cell"></td></tr></table>');
    });
});
