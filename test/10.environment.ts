#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

const TESTNAME = __filename.split("/").pop();

declare const msCrypto: any;

const UI8AtoHEX = (data: Uint8Array) => [].map.call(data, (num: number) => (num + 256).toString(16).substr(-2)).join("");
const ABtoHEX = (data: ArrayBuffer) => UI8AtoHEX(new Uint8Array(data));

/**
 * This is not a test but just shows environment.
 */

describe(TESTNAME, () => {

    let nodeCrypto = require("crypto");
    if (nodeCrypto && "function" !== typeof nodeCrypto.createHash) nodeCrypto = null;

    const w3cSubtle = ("undefined" !== typeof crypto) && crypto.subtle && ("function" === typeof crypto.subtle.digest) && crypto.subtle || null;
    const msSubtle = ("undefined" !== typeof msCrypto) && msCrypto.subtle && ("function" === typeof msCrypto.subtle.digest) && msCrypto.subtle || null;
    const encodeText = ("function" === typeof TextEncoder) && ((str: string) => new TextEncoder().encode(str)) || null;

    const oneByte = new Uint8Array([0x66, 0x6f, 0x6f]); // "foo"
    const expected = "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae";

    (nodeCrypto ? it : it.skip)("require('crypto').createHash()", async () => {
        assert.equal(typeof nodeCrypto.createHash, "function");
        assert.equal(nodeCrypto.createHash("SHA256").update("foo").digest("hex"), expected);
    });

    (w3cSubtle ? it : it.skip)("crypto.subtle.digest()", async () => {
        assert.equal(typeof crypto.subtle.digest, "function");
        assert.equal(ABtoHEX(await crypto.subtle.digest("SHA-256", oneByte)), expected);
    });

    (msSubtle ? it : it.skip)("msCrypto.subtle.digest()", async () => {
        assert.equal(typeof msCrypto.subtle.digest, "function");
    });

    (encodeText ? it : it.skip)("new TextEncoder().encode()", async () => {
        assert.equal(typeof TextEncoder, "function");
        assert.equal(UI8AtoHEX(encodeText("foo")), "666f6f");
    });
});
