import child from './child.mjs'
import child2 from './child2.js'

export default function () {
  console.log('foo', typeof require);
  child();
  child2();
}
