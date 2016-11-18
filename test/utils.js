'use strict';

const assert = require('assert');
require('babel-register');
const utils = require('../lib/utils');

describe('Utils', () => {
	it('find unescaped tokens', () => {
		const find = str => utils.findUnescapedTokens(str, '$#');

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

	it('replace ranges', () => {
		const r = (start, len) => utils.range(start, len);
		const replace = utils.replaceRanges;

		assert.equal(replace('a a a', [r(0, 1), r(4, 1)], 'bbb'), 'bbb a bbb');
		assert.equal(replace('a b c', [r(0, 1), r(4, 1)], t => t === 'a' ? 'foo' : 'bar'), 'foo b bar');
	});
});
