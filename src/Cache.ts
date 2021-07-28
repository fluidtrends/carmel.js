import debug from 'debug'

const LOG = debug("carmel:cache")

enum STORE {
    SESSION = "session",
    DATA = "data",
    IDENTITY= "identity",
    BLOBS = "blobs"
}

export class Cache {
    public static STORE = STORE

    private _level: any
    private _stores: any
    
    constructor () {
        this._level = require('level')
        this._stores = {}

        Object.keys(STORE).map((s: string) => {
            this.stores[s] = this.level(`cache_${s.toLowerCase()}`, { prefix: "carmel/" })
        })
    }

    get level () {
        return this._level
    }

    get stores() {
        return this._stores
    }

    store(type: STORE) {
        return this.stores[type]
    }

    _parseId(id: string) {
        const parts = id.split("/")
        const type = parts.shift()
        return [type, parts.join("/")]
    }

    async put(itemId: string, data: any) {
        try {
            const [type, id] = this._parseId(itemId)
            this.stores[type!.toUpperCase()].put(id, JSON.stringify(data))

            LOG(`put [item=${itemId}]`)
        } catch (e: any) {
            console.log(e)
        }
    }

    async get(itemId: string) {
        const [type, id] = this._parseId(itemId)
        
        LOG(`get [item=${itemId}]`)

        return this.stores[type!.toUpperCase()].get(id).then((d: any) => JSON.parse(d)).catch((err: any) => {})
    }

    async remove(itemId: string) {
        const [type, id] = this._parseId(itemId)
        
        LOG(`remove [item=${itemId}]`)

        return this.stores[type!.toUpperCase()].del(id).catch((err: any) => {})
    }
}