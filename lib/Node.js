"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = exports.CARMEL_EVENTS = exports.IPFS_BROWSER_CONFIG = void 0;
const IPFS_BROWSER_CONFIG = (Swarm, repo) => {
    return {
        start: true,
        init: true,
        repo,
        EXPERIMENTAL: {
            pubsub: true
        },
        relay: {
            enabled: true,
            hop: {
                enabled: true
            }
        },
        config: {
            Addresses: {
                Swarm
            },
            Bootstrap: []
        }
    };
};
exports.IPFS_BROWSER_CONFIG = IPFS_BROWSER_CONFIG;
exports.CARMEL_EVENTS = ['main'];
class Node {
    constructor() {
        this._cid = "";
        this._mesh = [];
        this._isBrowser = (typeof window !== 'undefined');
        this._listen = this.listen.bind(this);
        this._send = this.send.bind(this);
        this._onEvent = this.onEvent.bind(this);
    }
    get mesh() {
        return this._mesh;
    }
    get ipfs() {
        return this._ipfs;
    }
    get ctl() {
        return this._ctl;
    }
    get cid() {
        return this._cid;
    }
    get isBrowser() {
        return this._isBrowser;
    }
    onEvent(type, event) {
        console.log("Received event", type);
        console.log(event);
    }
    send(type, event) {
        if (!this.ipfs)
            return;
        this.ipfs.pubsub.publish(`#carmel:${type}`, JSON.stringify(event));
    }
    async listen(type) {
        this.ipfs.pubsub.subscribe(`#carmel:${type}`, (message) => {
            try {
                const { from, data } = message;
                const e = data.toString();
                if (from === this.cid)
                    return;
                this._onEvent(type, JSON.parse(e));
            }
            catch (err) { }
        });
    }
    async resolveMesh() {
        const servers = [{
                url: "carmel-node-y.chunky.io",
                port: 443
            }];
        this._mesh = servers.map((s) => `/dns4/${s.url}/tcp/${s.port || 443}/wss/p2p-webrtc-star`);
        return this.mesh;
    }
    async startIPFS() {
        let repo = `ipfs-repo`;
        if (this.isBrowser) {
            this._ipfs = await require('ipfs').create(exports.IPFS_BROWSER_CONFIG(this.mesh, repo));
            return;
        }
        const { IPFS_PATH } = process.env;
        // process.env.IPFS_PATH = this.nodeDir?.dir('ipfs')?.make()?.path
        // const ipfsConfig = JSON.parse(fs.readFileSync(path.resolve(process.env.IPFS_PATH!, 'config'), 'utf-8'))
        // const ipfsClient = require('ipfs-http-client')
        // const node = ipfsClient(ipfsConfig.Addresses.API)
        // this._ipfs = node.api
    }
    async start() {
        await this.resolveMesh();
        await this.startIPFS();
        if (!this.ipfs)
            return;
        const { id } = await this.ipfs.id();
        this._cid = id;
        console.log("CID", this.cid);
        await Promise.all(exports.CARMEL_EVENTS.map((e) => this._listen(e)));
    }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map