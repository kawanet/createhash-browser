/**
 * createhash-browser.d.ts
 *
 * @see https://github.com/kawanet/createhash-browser
 */

/**
 * Uses native implementation of `crypto.createHash` or `crypto.subtle.digest` if available.
 */

export declare function createHash(algorithm?: string): CH.AsyncHash;

/**
 * Forces to use the pure JavaScript implementation for test purpose.
 */

export declare function createHashJS(algorithm: string): CH.AsyncHash;

export declare namespace CH {
    /**
     * require("createhash-browser").createHash()
     */

    interface AsyncHash {
        update(data: string, encoding?: string): this;

        update(data: Uint8Array): this;

        digest(): Promise<Uint8Array>;

        digest(encoding: string): Promise<string>;
    }

    /**
     * require("crypto").createHash()
     */

    interface SyncHash {
        update(data: string, encoding?: string): this;

        update(data: Uint8Array): this;

        digest(encoding: string): string;

        digest(): Uint8Array;
    }
}
