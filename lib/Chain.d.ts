import { Session } from '.';
export declare class Chain {
    private _account;
    private _session;
    constructor(session: Session);
    get session(): Session;
    get account(): any;
    createAction(contract: string, name: string, data: any): {
        account: string;
        name: string;
        authorization: {
            actor: any;
            permission: string;
        }[];
        data: any;
    };
    getBalance(account: string): Promise<{
        eos: number;
        carmel: number;
    }>;
    read(contract: string, scope: string, table: string, index: any): Promise<any>;
    readSystem(table: string, index: any): Promise<{
        data: any;
    }>;
    getUser(username: string): Promise<any>;
    getMyUser(): Promise<any>;
    getMyBalance(): Promise<{
        eos: number;
        carmel: number;
    }>;
    refresh(): Promise<void>;
    sendTransaction(contract: string, name: string, data: any): Promise<any>;
    sendSystemTransaction(name: string, data: any): Promise<any>;
    createNewAccount(data: any): Promise<any>;
    init(): Promise<void>;
}
