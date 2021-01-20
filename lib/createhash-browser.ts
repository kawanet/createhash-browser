/**
 * createhash-browser.ts
 *
 * @see https://github.com/kawanet/createhash-browser
 */

import {CH} from "../types/createhash-browser";

type AsyncHash = CH.AsyncHash;
type SyncHash = CH.SyncHash;
type NodeCrypto = { createHash: (algorithm: string) => SyncHash };

interface W3CSubtle {
    digest(algorithm: string, data: Uint8Array): Promise<ArrayBuffer>;
}

interface MsSubtle {
    digest(algorithm: string, data: Uint8Array): {
        oncomplete: (res: { target: { result: ArrayBuffer } }) => any,
        onerror: (err: any) => any,
    }
}

interface NodeDigest {
    digest(encoding: string): string;

    digest(): Uint8Array;
}

declare const msCrypto: { subtle: MsSubtle };

const shimCrypto: { [algo: string]: { createHash: () => SyncHash } } = {
    "SHA1": require("sha1-uint8array"),
    "SHA256": require("sha256-uint8array"),
};

let nodeCrypto: NodeCrypto = require("crypto");
if (nodeCrypto && "function" !== typeof nodeCrypto.createHash) nodeCrypto = null;

let w3cSubtle: W3CSubtle = ("undefined" !== typeof crypto) && crypto.subtle;
if (w3cSubtle && "function" !== typeof w3cSubtle.digest) w3cSubtle = null;

let msSubtle: MsSubtle = ("undefined" !== typeof msCrypto) && msCrypto.subtle;
if (msSubtle && "function" !== typeof msCrypto.subtle.digest) msSubtle = null;

if (!w3cSubtle && msSubtle) w3cSubtle = {digest: msDigest};

const encodeText = ("function" === typeof TextEncoder) && ((str: string) => new TextEncoder().encode(str)) || null;
const toHEX = (data: Uint8Array) => [].map.call(data, (num: number) => (num + 256).toString(16).substr(-2)).join("");
const NG = {} as { [algo: string]: boolean };
const ZERO = {} as { [size: string]: Uint8Array };

/**
 * Uses native implementation of `crypto.createHash` or `crypto.subtle.digest` if available.
 */

export function createHash(algorithm: string): AsyncHash {
    return new Hash(algorithm, nodeCrypto, w3cSubtle);
}

/**
 * Forces to use the pure JavaScript implementation for test purpose.
 */

export function createHashJS(algorithm: string): AsyncHash {
    return new Hash(algorithm);
}

/**
 * Node.js crypto requests SHA1 without hyphen.
 * W3C crypto requests SHA-1 with hyphen.
 */

function algoName(algo: string): string {
    if (algo) return algo.replace(/^SHA-?/i, "SHA-");
}

/**
 * convert msCrypto.subtle to W3C crypto.subtle
 */

function msDigest(algo: string, data: Uint8Array): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const res = msSubtle.digest(algo, data);
        res.oncomplete = res => resolve(res.target.result);
        res.onerror = err => reject(err);
    });
}

/**
 * convert ArrayBuffer to Node-style digest() method
 */

function toNodeDigest(result: ArrayBuffer): NodeDigest {
    return {
        digest(encoding?: string) {
            const buf = new Uint8Array(result);
            if (encoding === "hex") return toHEX(buf);
            return buf;
        }
    };
}

class Hash implements AsyncHash {
    private promise: Promise<NodeDigest> = null;

    constructor(private algo: string, private native?: NodeCrypto, private subtle?: W3CSubtle) {
        //
    }

    update(data: string | Uint8Array): this {
        const {algo, native, subtle} = this;

        if (this.promise) {
            this.promise = Promise.reject(new Error("multiple update() not allowed"));
        } else {
            this.promise = Promise.resolve().then(() => {
                const isString = ("string" === typeof data);
                const trySubtle = subtle && !(isString && !encodeText) && !(msSubtle && data && !data.length) && !NG[algo];

                // try SubtleCrypto at first
                if (trySubtle) {
                    if (isString) data = encodeText(data as string);
                    return subtle.digest(algoName(algo), data as Uint8Array).then(toNodeDigest).catch(fallback);
                }

                // fallback otherwise
                return fallback();

                function fallback(reason?: any) {
                    // flag NG to the next request
                    if (reason) NG[algo] = true;

                    const c = native || shimCrypto[algo] || (algo && shimCrypto[algo.toUpperCase()]);
                    if (!c) return Promise.reject(reason || new Error("Digest method not supported"));

                    return c.createHash(algo).update(data as any);
                }
            });
        }

        return this;
    }

    digest(encoding: string): Promise<string>;
    digest(): Promise<Uint8Array>;
    digest(encoding?: string) {
        const {promise} = this;

        // call update() when update() not called yet.
        if (!promise) {
            const zero = ZERO[0] || (ZERO[0] = new Uint8Array(0));
            return this.update(zero).digest(encoding);
        }

        return promise.then(hash => hash.digest(encoding) as string | Uint8Array);
    }
}
