#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {createHash, createHashJS} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    describe("createHash('sha1')", () => testFor(createHash));

    describe("createHashJS('sha1')", () => testFor(createHashJS));
});

function testFor(createHash: typeof createHashJS) {
    it("input: string", async () => {
        assert.equal(await createHash("SHA1").update("foo").digest("hex"), "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33");
    });

    it("input: Uint8Array", async () => {
        const data = new Uint8Array([102, 111, 111]);
        assert.equal(await createHash("SHA1").update(data).digest("hex"), "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33");
    });

    it("input: empty, output: hex", async () => {
        const expected = "da39a3ee5e6b4b0d3255bfef95601890afd80709";

        assert.equal(await createHash("SHA1").update("").digest("hex"), expected, 'update("")');

        assert.equal(await createHash("SHA1").update(new Uint8Array(0)).digest("hex"), expected, "update(new Uint8Array(0))");

        assert.equal(await createHash("SHA1").digest("hex"), expected, "without update()");
    });

    it("input: empty, output: Uint8Array", async () => {
        const expected = [218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9];

        assert.deepEqual(Array.from(await createHash("SHA1").update("").digest()), expected, 'update("")');

        assert.deepEqual(Array.from(await createHash("SHA1").update(new Uint8Array(0)).digest()), expected, "update(new Uint8Array(0))");

        assert.deepEqual(Array.from(await createHash("SHA1").digest()), expected, "without update()");
    });
}
