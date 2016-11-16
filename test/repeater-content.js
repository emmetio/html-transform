'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
require('babel-register');
const find = require('../lib/repeater-content').findPlaceholders;

describe('Repeater content', () => {
    it('find placeholders', () => {
        assert.deepEqual(find('foo'), []);
        assert.deepEqual(find('$#'), [[0, 2]]);
        assert.deepEqual(find('foo$#'), [[3, 2]]);
        assert.deepEqual(find('foo$#bar'), [[3, 2]]);
        assert.deepEqual(find('foo$#bar$#baz'), [[3, 2], [8, 2]]);

        // escaped placeholders
        assert.deepEqual(find('\\$#'), []);
        assert.deepEqual(find('\\$$#'), [[2, 2]]);
        assert.deepEqual(find('foo\\$#bar$#baz'), [[9, 2]]);
        assert.deepEqual(find('$#\\'), [[0, 2]]);
    });
});
