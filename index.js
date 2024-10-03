const bar = require('./bar');

bar();

const { default: abc } = require('./abc');

abc();

const { default: child2 } = require('./foo/child2.js');

child2();

const { default: child } = require('./foo/child.mjs');

child();

const { default: foo } = require('./foo');

foo();
