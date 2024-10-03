import child from './child.mjs'

export default function () {
  console.log('foo', typeof require);
  child();
}
