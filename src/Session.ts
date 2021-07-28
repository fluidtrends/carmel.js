import { nanoid } from 'nanoid'
import { 
    Wallet, 
    Identity, 
    Cache, 
    ACCOUNT,
    Chain, 
    Data,
    IListener,
    Node,
    resolveChunks,
    EVENT,
    SESSION_STATUS
} from '.'
import * as Bowser from "bowser"
import debug from 'debug'

const LOG = debug("carmel:session")
const REVISION = 'test-001'

export class Session {
    private _id: string 
    private _wallet?: Wallet
    private _data: any
    private _chain: Chain
    private _identity?: Identity
    private _isBrowser: boolean
    private _account?: ACCOUNT
    private _cache: Cache
    private _status: SESSION_STATUS
    private _config: any
    private _listeners: any
    private _app: any 
    private _dir: any
    private _node: Node
    private _dispatch: any

    constructor(config: any, dispatch: any) {
        this._config = config
        this._dispatch = dispatch
        this._isBrowser = (typeof window !== 'undefined')
        this._cache = new Cache()
        this._data = { account: new Data(this, 'account') }
        this._chain = new Chain(this)
        this._status = SESSION_STATUS.NEW
        this._node = new Node(this)
        this._id = ""
        this._listeners = []        

        Object.keys(this.config.data || {}).map(async (slice: string) => this._data[slice] = new Data(this, slice))
    }

    async save() {
        await this.cache.put(`session/id`, this.id)
        await this.cache.put(`session/account`, this.account || "")
        await Promise.all(Object.keys(this.data || {}).map(async (slice: string) => this.data[slice].save()))
    }

    async load() {
        this._id = await this.cache.get(`session/id`) || nanoid()
        this._account = await this.cache.get(`session/account`)
        await Promise.all(Object.keys(this.data || {}).map(async (slice: string) => this.data[slice].init()))
    }

    async init () {
        await this.load() 
        await this.save()
    }

    get app () {
        return this._app
    }

    get dir () { 
        return this._dir
    }

    get account() {
        return this._account
    }

    get listeners() {
        return this._listeners
    }

    get chain() {
        return this._chain
    }

    get dispatch () {
        return this._dispatch
    }

    get identity() {
        return this._identity
    }

    get config() { 
        return this._config
    }

    get id() {
        return this._id
    }

    get node () {
        return this._node
    }

    get status() {
        return this._status
    }

    get cache() {
        return this._cache
    }

    get wallet() {
        return this._wallet
    }
    
    get data() {
        return this._data
    }

    get isBrowser() {
        return this._isBrowser
    }

    openWalletFromMnemonic(mnemonic: string) {
        this._wallet = new Wallet(mnemonic)
        return this.wallet
    }

    listen(onEvent: any) {
        this.listeners.push(<IListener>{ onEvent })
    }

    onEvent(type: EVENT, data: any) {
        this.listeners.map((listener: IListener) => {
            listener.onEvent(type, nanoid(), data)
        })
    }

    setStatus(s: SESSION_STATUS) {
        LOG(`changed status [status=${s}]`)

        this._status = s
        this.onEvent(EVENT.STATUS_CHANGED, s)
    }

    get isReady() {
        return this.status >= SESSION_STATUS.READY
    }

    toJSON() {
        return ({
            id: this.id,
            cid: this.id
        })
    }

    async start(ipfs?: any) {
        LOG(`starting [revision=${REVISION}]`)
        
        this.setStatus(SESSION_STATUS.INITIALIZING)

        await this.init()
        // await this.node.start(ipfs)
        await this.save()

        this.setStatus(SESSION_STATUS.READY)
    }

    async findUser (username: string, login: boolean) {
        LOG(`looking up user ${username} ...`)
        const user = await this.chain.getUser(username)

        LOG(`user lookup done`)
        this.onEvent(EVENT.USER_LOOKUP_DONE, { username, ...user, login })
        
        return user
    }

    async saveAccount(data: any) {
        const acct = await this.cache.get("session/account")

        if (!acct) return

        await this.cache.put("session/account", { ...acct, ...data })
    }

    async updateAccount(fields: any) {
        const acct = await this.cache.get("session/account")

        if (!acct) return

        const { privateKey, pub_key, publicKey, username } = acct
        
        if (!username) return

        const timestamp = Date.now()
        const rev = parseInt(acct.rev) + 1

        const profile = { username, timestamp, rev, ...fields }

        this.data.account.main.update({ ...profile })
        const saved = await this.data.account.save()

        const doc = await this.node.push('main', saved)
        
        if (!doc) return 

        const id = new Identity()
        id.init(pub_key || publicKey, privateKey)
        
        const did = `${rev}:did:carmel:${doc!.cid}`
        const sig = id.sign(did)

        this.node.send.update_account({ username, did, sig })
        await this.cache.put("session/account", {...acct, ...profile, rev: acct.rev, did })
    }

    async createAccount (username: string, mnemonic: string, signature: string) {
        this._identity = this.openWalletFromMnemonic(mnemonic)!.getIdentity()
        const { privateKey, publicKey } = this.identity!
        const timestamp = Date.now()
        const rev = 0

        this.data.account.main.update({ username, timestamp, rev })

        const saved = await this.data.account.save()
        const doc = await this.node.push('main', saved)

        if (!doc) return 

        const acct = { privateKey, publicKey, username, signature, rev, cid: `${doc!.cid!}` } as ACCOUNT

        await this.cache.put("session/account", acct)

        this.node.send.create_account({ username, publicKey, did: `did:carmel:${doc!.cid}` })
    }

    async createAccountFromIdentity (data: any) {
        const { did, rev, id, username } = data 

        const cid = did.substring('did:carmel:'.length)
        let doc = await this.node.pull('main', cid)

        if (!doc) return 

        await this.data.account.load(doc.data)

        const profile = this.data.account.content.profile
        const acct =  { ...data, ...profile } as ACCOUNT

        await this.cache.put("session/account", acct)
    }

    async loadUser (user: any) {
        if (!user) return 

        LOG(`looking up user data ${user.username} ...`)

        const cid = user.did.substring('did:carmel:'.length)
        let doc = await this.node.pull(`user_${user.username}`, cid)

        if (!doc) return 

        const userData = new Data(this)
        await userData.load(doc.data)
        const profile = userData.content.profile

        const acct =  { ...user, ...profile } as ACCOUNT

        LOG(`user data lookup done`)

        this.onEvent(EVENT.USER_DATA_LOOKUP_DONE, acct)

        return acct
    }

    async clearAccount() {
        await this.cache.remove("session/account")
        this._account = undefined
    }
}