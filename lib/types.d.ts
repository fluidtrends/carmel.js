export declare enum SESSION_STATUS {
    NEW = "new",
    INITIALIZING = "init",
    READY = "ready"
}
export declare enum EVENT {
    STATUS_CHANGED = 0,
    USER_LOOKUP_DONE = 1,
    USER_CREATED = 2,
    WORK_DONE = 3
}
export declare enum WORK {
    REGISTER = 0
}
export declare type ACCOUNT = {
    username: string;
    signature: string;
    publicKey: string;
    privateKey?: string;
};
export interface IListener {
    onEvent(type: EVENT, id: string, data: any): void;
}
