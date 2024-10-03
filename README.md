# Investigation ESM-files in `require()`

## Experiments

### Without `--experimental-require-module`

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

### With `--experimental-require-module`

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

## Conclusion

In Node.js `22.9.0` an ESM-file can still be loaded successfully with `require()` without `--experimental-require-module` if:

- It uses the `.js` extension
- It doesn't have any `import`

It works both through full path and through the [Folders as modules](https://nodejs.org/api/modules.html#folders-as-modules) functionality and the file acts as a proper ESM-file with `require` being `undefined` and `import.meta.url` being set to the file path.

In Node.js `22.9.0` the `--experimental-require-module` option is needed to load an ESM-file with `require()` when either:

- The `.mjs` extension is used
- It contains `import` statements
