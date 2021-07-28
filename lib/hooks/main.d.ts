import { EVENT, SESSION_STATUS } from '..';
export declare const useCarmel: (config: any) => {
    session: any;
    events: any;
    saveMnemonicToFile: (mnemonic: string) => void;
    saveSignatureToFile: () => void;
    ready: boolean;
    logout: () => Promise<void>;
    newEvent: any;
    account: any;
    loggedIn: boolean;
    EVENT: typeof EVENT;
    SESSION_STATUS: typeof SESSION_STATUS;
    register: (username: string, password: string) => void;
    login: (username: string, password: string) => void;
    newIdentity: any;
};
