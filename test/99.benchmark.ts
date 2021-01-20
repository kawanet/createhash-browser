#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as SHA1 from "sha1-uint8array";
import * as SHA256 from "sha256-uint8array";

import {createHash, createHashJS} from "../lib/createhash-browser";

const TITLE = __filename.split("/").pop();

const isBrowser = ("undefined" !== typeof window);

const REPEAT = process.env.REPEAT || (isBrowser ? 10000 : 10000);

const stringToUint8Array = (text: string) => new Uint8Array([].map.call(unescape(encodeURI(text)), (c: string) => c.charCodeAt(0)));
const toArray = (data: number[] | Uint8Array) => [].slice.call(data);
const w3cSubtle = ("undefined" !== typeof crypto) && crypto.subtle && ("function" === typeof crypto.subtle.digest) && crypto.subtle || null;

describe(`REPEAT=${REPEAT} ${TITLE}`, () => {

    const text = JSON.stringify(require("../package.json"));
    const data = stringToUint8Array(text);

    describe("SHA-1", () => {
        const hex = SHA1.createHash("sha1").update(text).digest("hex");
        const bin = toArray(SHA1.createHash("sha1").update(text).digest());

        (w3cSubtle ? it : it.skip)('crypto.subtle.digest("sha1", data)', binTest(async () => new Uint8Array(await crypto.subtle.digest("SHA-1", data)), bin));

        it('createHash("sha1").update(text).digest()', binTest(() => createHash("sha1").update(text).digest(), bin));
        it('createHash("sha1").update(data).digest()', binTest(() => createHash("sha1").update(data).digest(), bin));
        it('createHashJS("sha1").update(text).digest()', binTest(() => createHashJS("sha1").update(text).digest(), bin));
        it('createHashJS("sha1").update(data).digest()', binTest(() => createHashJS("sha1").update(data).digest(), bin));

        it('createHash("sha1").update(text).digest("hex")', hexTest(() => createHash("sha1").update(text).digest("hex"), hex));
        it('createHash("sha1").update(data).digest("hex")', hexTest(() => createHash("sha1").update(data).digest("hex"), hex));
        it('createHashJS("sha1").update(text).digest("hex")', hexTest(() => createHashJS("sha1").update(text).digest("hex"), hex));
        it('createHashJS("sha1").update(data).digest("hex")', hexTest(() => createHashJS("sha1").update(data).digest("hex"), hex));

        it('SHA1.createHash().update(data).digest("hex")', hexTest(() => SHA1.createHash().update(data).digest("hex"), hex));
    });

    describe("SHA-2", () => {
        const hex = SHA256.createHash("sha256").update(text).digest("hex");
        const bin = toArray(SHA256.createHash("sha256").update(text).digest());

        (w3cSubtle ? it : it.skip)('crypto.subtle.digest("sha256", data)', binTest(async () => new Uint8Array(await crypto.subtle.digest("SHA-256", data)), bin));

        it('createHash("sha256").update(text).digest()', binTest(() => createHash("sha256").update(text).digest(), bin));
        it('createHash("sha256").update(data).digest()', binTest(() => createHash("sha256").update(data).digest(), bin));
        it('createHashJS("sha256").update(text).digest()', binTest(() => createHashJS("sha256").update(text).digest(), bin));
        it('createHashJS("sha256").update(data).digest()', binTest(() => createHashJS("sha256").update(data).digest(), bin));

        it('createHash("sha256").update(text).digest("hex")', hexTest(() => createHash("sha256").update(text).digest("hex"), hex));
        it('createHash("sha256").update(data).digest("hex")', hexTest(() => createHash("sha256").update(data).digest("hex"), hex));
        it('createHashJS("sha256").update(text).digest("hex")', hexTest(() => createHashJS("sha256").update(text).digest("hex"), hex));
        it('createHashJS("sha256").update(data).digest("hex")', hexTest(() => createHashJS("sha256").update(data).digest("hex"), hex));

        it('SHA256.createHash().update(data).digest("hex")', hexTest(() => SHA256.createHash().update(data).digest("hex"), hex));
    });
});

/**
 * digest("hex") returns Promise<string>
 */

function hexTest(fn: () => string | Promise<string>, expect: string) {
    return async function (this: Mocha.Context) {
        this.timeout(10000);
        let p = Promise.resolve();

        for (let i = 0; i < REPEAT; i++) {
            assert.equal(await fn(), expect);
            // p = p.then(fn).then(actual => assert.equal(actual, expect));
        }

        return p;
    };
}

/**
 * digest() returns Promise<Uint8Array>
 */

function binTest(fn: () => Uint8Array | Promise<Uint8Array>, expect: number[]) {
    return async function (this: Mocha.Context) {
        this.timeout(10000);
        let p = Promise.resolve();

        for (let i = 0; i < REPEAT; i++) {
            assert.deepEqual(toArray(await fn()), expect);
            // p = p.then(fn).then(actual => assert.deepEqual(toArray(actual), expect));
        }

        return p;
    };
}
