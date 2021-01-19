#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {createHash, createHashJS} from "../lib/createhash-browser";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    describe("createHash('sha256')", () => testFor(createHash));

    describe("createHashJS('sha256')", () => testFor(createHashJS));
});

function testFor(createHash: typeof createHashJS) {
    it("input: string", async () => {
        assert.equal(await createHash("SHA256").update("foo").digest("hex"), "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae");
    });

    it("input: Uint8Array", async () => {
        const data = new Uint8Array([102, 111, 111]);
        assert.equal(await createHash("SHA256").update(data).digest("hex"), "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae");
    });

    it("input: empty, output: hex", async () => {
        const expected = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

        assert.equal(await createHash("SHA256").update("").digest("hex"), expected, 'update("")');

        assert.equal(await createHash("SHA256").update(new Uint8Array(0)).digest("hex"), expected, "update(new Uint8Array(0))");

        assert.equal(await createHash("SHA256").digest("hex"), expected, "without update()");
    });

    it("input: empty, output: Uint8Array", async () => {
        const expected = [
            227, 176, 196, 66, 152, 252, 28, 20, 154, 251, 244, 200, 153, 111, 185, 36,
            39, 174, 65, 228, 100, 155, 147, 76, 164, 149, 153, 27, 120, 82, 184, 85];

        assert.deepEqual(Array.from(await createHash("SHA256").update("").digest()), expected, 'update("")');

        assert.deepEqual(Array.from(await createHash("SHA256").update(new Uint8Array(0)).digest()), expected, "update(new Uint8Array(0))");

        assert.deepEqual(Array.from(await createHash("SHA256").digest()), expected, "without update()");
    });
}
