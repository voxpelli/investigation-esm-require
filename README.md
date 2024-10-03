# Investigation ESM-files in `require()`

## Experiments

### Node.js `22.9.0` without `--experimental-require-module`

Using Node.js `22.9.0` this is the result of running `node .`:

```
bar function
abc undefined file:///Users/foo/esm-require/abc/index.js
child2 undefined file:///Users/foo/esm-require/foo/child2.js
node:internal/modules/cjs/loader:1308
    throw new ERR_REQUIRE_ESM(filename, true);
    ^

Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/foo/esm-require/foo/child.mjs not supported.
Instead change the require of /Users/foo/esm-require/foo/child.mjs to a dynamic import() which is available in all CommonJS modules.
    at TracingChannel.traceSync (node:diagnostics_channel:315:14)
    at Object.<anonymous> (/Users/foo/esm-require/index.js:13:28) {
  code: 'ERR_REQUIRE_ESM'
}

Node.js v22.9.0
```

### Node.js `22.9.0` with `--experimental-require-module`

Using Node.js `22.9.0` this is the result of running `node --experimental-require-module .`:

```
bar function
abc undefined file:///Users/foo/esm-require/abc/index.js
child2 undefined file:///Users/foo/esm-require/foo/child2.js
child
foo undefined
child
child2 undefined file:///Users/foo/esm-require/foo/child2.js
(node:88647) ExperimentalWarning: Support for loading ES Module in require() is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### Node.js `20.17.0`

This version does not support the `--experimental-require-module` flag so it can only run in one mode, and the result is:

```js
bar function
/Users/foo/esm-require/abc/index.js:1
export default function () {
^^^^^^

SyntaxError: Unexpected token 'export'
    at wrapSafe (node:internal/modules/cjs/loader:1378:20)
    at Module._compile (node:internal/modules/cjs/loader:1428:41)
    at Module._extensions..js (node:internal/modules/cjs/loader:1548:10)
    at Module.load (node:internal/modules/cjs/loader:1288:32)
    at Module._load (node:internal/modules/cjs/loader:1104:12)
    at Module.require (node:internal/modules/cjs/loader:1311:19)
    at require (node:internal/modules/helpers:179:18)
    at Object.<anonymous> (/Users/foo/esm-require/index.js:5:26)
    at Module._compile (node:internal/modules/cjs/loader:1469:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1548:10)

Node.js v20.17.0
```

## Conclusion

In Node.js `22.9.0` but not `20.17.0` an ESM-file can be loaded successfully through `require()` even without `--experimental-require-module` if:

- It uses the `.js` extension
- It doesn't have any `import`

And it works both through full path and through the [Folders as modules](https://nodejs.org/api/modules.html#folders-as-modules) functionality and the file acts as a proper ESM-file with `require` being `undefined` and eg. `import.meta.url` being set to the path to the file.

The `--experimental-require-module` seems to only be needed in Node.js `22.9.0` when the ESM-file either:

- Has the `.mjs` extension
- Contains `import` statements

Another conclusion is that the [Folders as modules](https://nodejs.org/api/modules.html#folders-as-modules) works for all files named `index.js` – no matter if its ESM or CJS – and doesn't work for any of `index.cjs` and `index.mjs`. This means that one the support for ESM in `require` has extended support for the [full `require` algorithm](https://nodejs.org/api/modules.html#all-together) to the ESM-space.

