"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCarmel = void 0;
const react_1 = require("react");
const __1 = require("..");
const useCarmel = (config) => {
    const [session, setSession] = react_1.useState();
    const [loggedIn, setLoggedIn] = react_1.useState(false);
    const [ready, setReady] = react_1.useState(false);
    const [events, setEvents] = react_1.useState([]);
    const [newEvent, setNewEvent] = react_1.useState();
    const [newIdentity, setNewIdentity] = react_1.useState();
    const [user, setUser] = react_1.useState();
    const [account, setAccount] = react_1.useState();
    const ecc = require('eosjs-ecc');
    const worker = new Worker('../workers/main.js', { type: 'module' });
    const onNewEvent = (e) => {
        setNewEvent(e);
        // console.log(session.node.ipfs)
        session.node.send('main', e);
    };
    worker.onmessage = async (event) => {
        const { type, result, data } = event.data;
        const _user = user;
        switch (type) {
            case "generateMnemonic":
                const { privateKey } = session.openWallet(result).getIdentity();
                worker.postMessage({ type: "generateSignature", data: Object.assign(Object.assign({}, data), { mnemonic: result, privateKey }) });
                break;
            case "generateSignature":
                await session.saveAccount(data.username, data.mnemonic, result);
                const account = session.account;
                onNewEvent({ type: __1.EVENT.USER_CREATED, data: { user: Object.assign(Object.assign({}, account), { mnemonic: data.mnemonic }) } });
                break;
        }
    };
    const init = async () => {
        session.listen((type, id, data) => {
            if (events.length === 0 || events[events.length - 1].id !== id) {
                onNewEvent({ type, id, data });
            }
            events.push({ type, id, data });
        });
        await session.start();
    };
    const register = (username, password) => {
        worker.postMessage({ type: "generateMnemonic", data: { username, password } });
    };
    const login = (username, password) => {
        worker.postMessage({ type: "login", data: { username, password } });
    };
    const logout = async () => {
        await session.clearAccount();
        setAccount(undefined);
    };
    const saveMnemonicToFile = (mnemonic) => {
        const { saveAs } = require('file-saver');
        const blob = new Blob([mnemonic], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "phrase.carmel");
    };
    const saveSignatureToFile = () => {
        const { saveAs } = require('file-saver');
        const blob = new Blob([account.signature], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "signature.carmel");
    };
    react_1.useEffect(() => {
        setSession(new __1.Session(config));
    }, []);
    react_1.useEffect(() => {
        (async () => {
            if (!session)
                return;
            await init();
            setAccount(session.account);
            setReady(true);
        })();
    }, [session]);
    return {
        session, events, saveMnemonicToFile, saveSignatureToFile, ready, logout, newEvent, account, loggedIn, EVENT: __1.EVENT, SESSION_STATUS: __1.SESSION_STATUS, register, login, newIdentity
    };
};
exports.useCarmel = useCarmel;
//# sourceMappingURL=main.js.map