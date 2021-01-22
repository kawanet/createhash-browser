# createhash-browser

[![Node.js CI](https://github.com/kawanet/createhash-browser/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/createhash-browser/actions/)
[![npm version](https://badge.fury.io/js/createhash-browser.svg)](https://www.npmjs.com/package/createhash-browser)

SHA-1 and SHA-256 cryptographic hash function both for browsers and Node.js

## SYNOPSIS

```js
const createHash = require("createhash-browser").createHash;

const text = "";
const hex = await createHash("sha1").update(text).digest("hex");
// => "da39a3ee5e6b4b0d3255bfef95601890afd80709"

const data = new Uint8Array(0);
const hash = await createHash("sha256").update(data).digest();
// => <Uint8Array e3 b0 c4 42 98 fc 1c 14 9a fb f4 c8 99 6f b9 24 27 ae 41 e4 64 9b 93 4c a4 95 99 1b 78 52 b8 55>
```

See TypeScript declaration
[createhash-browser.d.ts](https://github.com/kawanet/createhash-browser/blob/main/types/createhash-browser.d.ts)
for detail.

## COMPATIBILITY

The interface is a `Promise` version of Node.js's [crypto](https://nodejs.org/api/crypto.html) module's
`createHash(algor).update(data).digest(format)` syntax.

| Methods | Sync / Async | Node.js | Modern browsers | Legacy browsers |
|----|----|----|----|----|
| Node.js's `crypto.createHash()` | synchronous | ✅ Only | ❌ N/A | ❌ N/A |   
| `createhash-browser` | `Promise` | ✅ Native |  ✅ Native |  ✅ Pure JS |
| W3C `crypto.subtle.digest()` | `Promise` | ❌ N/A | ✅ Most browsers | ❌ N/A |
| IE11 `msCrypto.subtle.digest()` | `oncomplete` | ❌ N/A | ❌ N/A | ✅ IE 11 only |

Note that W3C
[SubtleCrypto](https://developer.mozilla.org/docs/Web/API/SubtleCrypto) API is only available on modern browsers under
[secure origins](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features) policy.
It wouldn't work, for example, on your `http://192.168.0.1:3000/` local server, unfortunately.

`createhash-browser` could work both on Node.js and browsers consistently.
It runs natively with `crypto.createHash` on Node.js,
and with `crypto.subtle.digest()` or `msCrypto.subtle.digest()` on browsers if available.
It could fallback to run with pure JavaScript implementations of
[sha1-uint8array](https://github.com/kawanet/sha1-uint8array) and
[sha256-uint8array](https://www.npmjs.com/package/sha256-uint8array) modules
in case those native methods not available.

## SPEED

Node.js's native `crypto` module runs faster than pure JavaScript implementation.
The benchmark shows an interesting result that `createHashJS()` runs even faster than native
`crypto.subtle.digest()` function on modern browsers, though.

### SHA-1

|Usage|Node v14|Chrome 87|Safari 14|IE 11|Note|
|----|----|----|----|----|----|
|createHash("sha1").update(data).digest("hex")|31ms 👍|369ms|446ms|1,527ms|auto|
|createHash("sha1").update(data).digest()|72ms|425ms|515ms|1,861ms|auto|
|createHash("sha1").update(text).digest("hex")|33ms|429ms|457ms|1,811ms|auto|
|createHash("sha1").update(text).digest()|75ms|489ms|561ms|2,222ms|auto|
|createHashJS("sha1").update(data).digest("hex")|94ms|173ms 👍|107ms 👍|1,504ms 👍|pure JS|
|createHashJS("sha1").update(data).digest()|101ms|214ms|178ms|1,856ms|pure JS|
|createHashJS("sha1").update(text).digest("hex")|144ms|218ms|148ms|1,778ms|pure JS|
|createHashJS("sha1").update(text).digest()|153ms|270ms|219ms|2,212ms|pure JS|

### SHA-256

|Usage|Node v14|Chrome 87|Safari 14|IE 11|Note|
|----|----|----|----|----|----|
|createHash("sha256").update(data).digest("hex")|45ms 👍|393ms|536ms|1,747ms 👍|auto|
|createHash("sha256").update(data).digest()|93ms|437ms|701ms|1,955ms|auto|
|createHash("sha256").update(text).digest("hex")|46ms|425ms|532ms|2,233ms|auto|
|createHash("sha256").update(text).digest()|96ms|495ms|719ms|2,683ms|auto|
|createHashJS("sha256").update(data).digest("hex")|122ms|245ms 👍|150ms 👍|1,962ms|pure JS|
|createHashJS("sha256").update(data).digest()|125ms|303ms|273ms|2,406ms|pure JS|
|createHashJS("sha256").update(text).digest("hex")|162ms|303ms|180ms|2,298ms|pure JS|
|createHashJS("sha256").update(text).digest()|167ms|366ms|314ms|2,680ms|pure JS|

The input is approx 1KB in length. The input variable `data` is an `Uint8Array`, `text` is a string.

The output format is a `hex` string or an `Uint8Array`.

The result above is tested on macOS 10.15.7 Intel Core i7 3.2GHz. Try it as below.

```sh
git clone https://github.com/kawanet/createhash-browser.git
cd createhash-browser
npm install
npm run build

# run the benchmark on Node.js
REPEAT=10000 ./node_modules/.bin/mocha test/99.benchmark.js

# run tests and the benchmark on browser
make -C browser
open browser/test.html
```

## BROWSER BUILD

The minified version of the library is also available for browsers via
[jsDelivr](https://www.jsdelivr.com/package/npm/createhash-browser) CDN.
It's just 9KB.

- Live Demo https://kawanet.github.io/createhash-browser/
- Minified https://cdn.jsdelivr.net/npm/createhash-browser/dist/createhash-browser.min.js

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise/dist/es6-promise.auto.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/createhash-browser/dist/createhash-browser.min.js"></script>
<script>
    const text = "";
    const hex = await CH.createHash("sha1").update(text).digest("hex");
    // => "da39a3ee5e6b4b0d3255bfef95601890afd80709"
    
    const data = new Uint8Array(0);
    const hash = await CH.createHash("sha256").update(data).digest();
    // => <Uint8Array e3 b0 c4 42 98 fc 1c 14 9a fb f4 c8 99 6f b9 24 27 ae 41 e4 64 9b 93 4c a4 95 99 1b 78 52 b8 55>
</script>
```

## SEE ALSO

- https://www.npmjs.com/package/createhash-browser
- https://github.com/kawanet/sha1-uint8array
- https://github.com/kawanet/sha256-uint8array
- https://github.com/kawanet/createhash-browser

## MIT LICENSE

Copyright (c) 2021 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
