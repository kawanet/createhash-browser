/**
 * createhash-browser.d.ts
 *
 * @see https://github.com/kawanet/createhash-browser
 */

export declare function createHash(algorithm?: string): CH.AsyncHash;

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
