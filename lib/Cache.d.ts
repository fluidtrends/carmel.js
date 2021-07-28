declare enum STORE {
    SESSION = "session",
    DATA = "data",
    IDENTITY = "identity"
}
export declare class Cache {
    static STORE: typeof STORE;
    private _level;
    private _stores;
    constructor();
    get level(): any;
    get stores(): any;
    store(type: STORE): any;
    _parseId(id: string): (string | undefined)[];
    put(itemId: string, data: any): Promise<void>;
    get(itemId: string): Promise<any>;
    remove(itemId: string): Promise<any>;
}
export {};
