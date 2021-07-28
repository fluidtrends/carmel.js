import { Session } from '.'
import bs58 from 'bs58'
import { convertToObject } from 'typescript'
import { Data, EVENT, SESSION_STATUS, SWARM_EVENT, events } from '.'
import debug from 'debug'

const LOG = debug("carmel:node")
const MIN_OPERATORS_REQUIRED = 1

export const IPFS_BROWSER_CONFIG: any = (Swarm: string[], repo: string) => {
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
            }
        }
    } as any
}

export const SYNC_INTERVAL = 1000
    
export class Node {
    private _cid: string 
    private _ipfs: any
    private _ctl: any
    private _isBrowser: boolean
    private _isOperator: boolean
    private _mesh: any
    private _listen: any
    private _onEvent: any
    private _onEventResult: any
    private _session: Session
    private _syncTimer: any
    private _send: any
    private sync: any
    private _swarm: any
    private _connected: boolean
    private _sendQueue: any

    constructor(session: Session) {
        this._session = session
        this._cid = ""
        this._isBrowser = (typeof window !== 'undefined')
        this._listen = this.listen.bind(this)
        this._onEvent = this.onEvent.bind(this)
        this._onEventResult = this.onEventResult.bind(this)
        this._connected = false 
        this._sendQueue = []
        this._isOperator = (session.config.settings && session.config.settings.eosAccountName && session.config.settings.eosUsername)
        this._swarm = { operators: {}, peers: {}, ipfs: {} }
        this.sync = this._sync.bind(this)
        this._send = { raw: this._sendRaw.bind(this) }
    }

    get connected () {
        return this._connected
    }

    get sendQueue() {
        return this._sendQueue
    }

    get syncTimer () {
        return this._syncTimer
    }

    get session () {
        return this._session
    }

    get mesh () {
        return this._mesh
    }

    get ipfs () {
        return this._ipfs
    }

    get ctl () {
        return this._ctl
    }

    get cid () {
        return this._cid
    }

    get isBrowser() {
        return this._isBrowser
    }

    get isOperator () {
        return this._isOperator
    }

    get send () {
        return this._send
    }

    get isConnected() {
        return this._connected
    }

    get swarm () {
        return this._swarm
    }

    stopSyncTimer() {
        if (!this.syncTimer) return 

        clearInterval(this.syncTimer)
    }

    async _sync () {
        const ipfsPeers = await this.ipfs.swarm.peers() || []
        const carmelOperators = await this.ipfs.pubsub.peers(`#carmel:events:${SWARM_EVENT.ACCEPT.toLowerCase()}`) || []
        this._connected = false

        console.log(carmelOperators)
        if (!carmelOperators || carmelOperators.length < MIN_OPERATORS_REQUIRED) {
            LOG(`looking for Carmel Operators [found=${carmelOperators.length} required=${MIN_OPERATORS_REQUIRED}]`)
            return 
        }

        carmelOperators.map((op: string) => this._swarm.operators[op] = { timestamp: Date.now() })
        this._connected = true

        this.session.onEvent(EVENT.CONNECTED, carmelOperators)

        LOG(`connected [carmelOperators=${carmelOperators.length}]`)

        await this.flushSendQueue()
    }

    async flushSendQueue () {
        this._sendQueue = await this.session.cache.get("session/sendqueue") || []

        if (this.sendQueue.length === 0) return 

        LOG(`flushing send queue [events=${this.sendQueue.length}]`)

        await Promise.all(this.sendQueue.map((m: any) => this.send.raw(m.type, m.event)))

        this._sendQueue = []
        await this.session.cache.put("session/sendqueue", [])

        LOG(`send queue completely flushed`)
    }

    async addToSendQueue(e: any) {
        this._sendQueue = await this.session.cache.get("session/sendqueue") || []
        this.sendQueue.push(e)
        await this.session.cache.put("session/sendqueue", this.sendQueue)
    }        

    startSyncTimer() {  
        this._syncTimer = setInterval(async () => {
           if (this.isConnected) {
               this.stopSyncTimer()
               return
           }

           await this.sync()
        }, SYNC_INTERVAL)
    }

    async ls (location?: string) {
        if (!this.ipfs) return 

        let result: any = []
        for await (const file of this.ipfs.files.ls(`/carmel${location ? '/' + location: ''}`)) {
            result.push(file)
        }

        return result
    }

    async open (id: string) {
        if (!this.ipfs) return
        let content = ""

        try {
            for await (const chunk of this.ipfs.files.read(`/carmel/${id}.json`)) {
                content = `${content}${Buffer.from(chunk).toString()}`
            }

            LOG(`opened content [id=${id}]`)
            
            return JSON.parse(content)
        } catch {
        }
    }

    async pull (id: string, cid: string) {
        if (!this.ipfs) return

        try {
            // Remove the old file if present
            await this.ipfs.files.rm(`/carmel/${id}.json`, { recursive: true })
            LOG(`removed content [id=${id}]`)
        } catch {
        }

        try {
            await this.ipfs.files.cp(`/ipfs/${cid}`, `/carmel/${id}.json`)

            LOG(`pulled content [id=${id} cid=${cid}]`)

            return this.open(id)
        } catch {
        }
    }

    async push (id: string, data: any) {
        if (!this.ipfs) return

        const content: string = JSON.stringify({
            timestamp: Date.now(),
            id,    
            did: `did:carmel:${id}`,
            data
        })

        try {
            // Remove the old file if present
            await this.ipfs.files.rm(`/carmel/${id}.json`, { recursive: true })
            LOG(`removed content [id=${id}]`)
        } catch {
        }

        await this.ipfs.files.write(`/carmel/${id}.json`, new TextEncoder().encode(content), { create: true })

        const result = await this.ls(`${id}.json`)

        if (!result || result.length !== 1) {
            return
        }

        const cid = result[0].cid.toString()
        await this.ipfs.pin.add(cid)

        LOG(`pushed content [id=${id} cid=${cid}]`)

        return ({
            cid,
            size: result[0].size,
            path: `/carmel/${id}.json`,
            id
        })
    }

    async onEvent (type: string, event: any) {
        LOG(`<- received event [type=${type}]`)

        const handler = events[`${type.toLowerCase()}` as keyof typeof events]
        
        if (!handler) return 

        // Handle it
        const result = await handler(this.session, event)

        // Send the result back
        const resultHandler = events[`${type.toLowerCase()}_result` as keyof typeof events]
        resultHandler && this.send.raw(`${type.toUpperCase()}_RESULT`, result)

        return result
    }

    async onEventResult (type: string, event: any) {
        LOG(`<- received event result [type=${type}]`)

        const handler = events[`${type.toLowerCase()}` as keyof typeof events]
        
        if (!handler) return 

        // Handle it
        return handler(this.session, event)
    }

    async _sendRaw (type: string, event: any) {
        if (!this.ipfs) return
    
        if (!this.isConnected) {
            LOG(`-> delaying event until connection is established [type=${type}]`)
            await this.addToSendQueue({ type, event })
            return 
        }

        this.ipfs.pubsub.publish(`#carmel:events:${type.toLowerCase()}`, JSON.stringify(event || {}))

        LOG(`=> sent event [type=${type}]`)
    }

    async listen(type: string, result: boolean = false) {
        LOG(`listen [event=${type}]`)

        this.ipfs.pubsub.subscribe(`#carmel:events:${type.toLowerCase()}`, (message: any) => {
            try {
                const { from, data } = message
                const e = data.toString()
                if (from === this.cid) return 
                result ? this._onEventResult(type, JSON.parse(e)) : this._onEvent(type, JSON.parse(e))
            } catch (err: any) {}
        })
    }

    async resolveMesh () {
        this._mesh = await this.session.chain.getMesh()
        return this.mesh
    }

    async startIPFS (ipfs?: any) {
        try {
            if (!this.mesh || !this.mesh.swarm) return 

            let repo = `ipfs-repo`
    
            if (this.isBrowser) {
                this._ipfs = await require('ipfs').create(IPFS_BROWSER_CONFIG(this.mesh.swarm, repo))
                return
            }

            if (!ipfs) {
                return
            }

            this._ipfs = ipfs!.api
        } catch (e: any) {
            console.log(e)
        }
    }

    async start(ipfs?: any) {        
        LOG(`starting [browser=${this.isBrowser}]`)

        await this.resolveMesh()
        await this.startIPFS(ipfs)

        if (!this.ipfs) return 

        const { id } = await this.ipfs.id()
        this._cid = id 

        await Promise.all(Object.keys(SWARM_EVENT).map((e: string) => {
            this._send[e.toLowerCase()] = async (props: any) => this._sendRaw(e, props || {})

            this.isOperator && this._listen(e)
            this.isOperator || this._listen(`${e}_RESULT`, true)
        }))

        await this.ipfs.files.mkdir('/carmel', { parents: true })

        LOG(`started ${this.isOperator ? 'as operator ': ''}[cid=${this.cid} browser=${this.isBrowser}]`)

        if (this.isOperator) {
            return
        }

        this.startSyncTimer()
        this.sync()
    }
}