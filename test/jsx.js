'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const jsx = require('../lib/jsx').default;
const stringify = require('./assets/stringify').default;

describe('JSX transform', () => {
	const expand = abbr => stringify( jsx( parse(abbr) ) );

    it('transform', () => {
		assert.equal(expand('div#foo.bar'), '<div id="foo" className="bar"></div>');
		assert.equal(expand('label[for=a]'), '<label htmlFor="a"></label>');
    });
});
