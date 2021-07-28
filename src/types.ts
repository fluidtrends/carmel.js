export enum SESSION_STATUS {
    NEW = "new",
    INITIALIZING = "init",
    READY = "ready"
}

export enum DATATYPE {
    TABLE = "table",
    OBJECT = "object"
}

export enum EVENT {
    STATUS_CHANGED,
    USER_LOOKUP_DONE,
    USER_DATA_LOOKUP_DONE,
    USER_CREATED,
    USER_LOGIN,
    DATA_CHANGED,
    SYNC_DONE,
    CONNECTED,
    WORK_DONE
}

export enum WORK {
    REGISTER
}

export enum SWARM_EVENT {
    ACCEPT = "ACCEPT",
    CREATE_ACCOUNT = "CREATE_ACCOUNT",
    UPDATE_ACCOUNT = "UPDATE_ACCOUNT"
}

export type ACCOUNT = {
    username: string,
    signature: string,
    publicKey: string,
    cid: string,
    privateKey?: string
}

export interface IListener  {
    onEvent(type: EVENT, id: string, data: any): void
}

