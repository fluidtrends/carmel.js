export declare const IPFS_BROWSER_CONFIG: any;
export declare const CARMEL_EVENTS: string[];
export declare class Node {
    private _cid;
    private _ipfs;
    private _ctl;
    private _isBrowser;
    private _mesh;
    private _listen;
    private _onEvent;
    private _send;
    constructor();
    get mesh(): string[];
    get ipfs(): any;
    get ctl(): any;
    get cid(): string;
    get isBrowser(): boolean;
    onEvent(type: string, event: any): void;
    send(type: string, event: any): void;
    listen(type: string): Promise<void>;
    resolveMesh(): Promise<string[]>;
    startIPFS(): Promise<void>;
    start(): Promise<void>;
}
