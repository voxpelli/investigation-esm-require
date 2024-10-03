const bar = require('./bar');

bar();

const { default: abc } = require('./abc');

abc();

const { default: foo } = require('./foo');

foo();
