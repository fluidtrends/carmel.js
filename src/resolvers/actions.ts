export const UPDATE = 'UPDATE'
export const UPDATE_BLOB = 'UPDATE_BLOB'

export const update = (adaptor: any, update: any = {}) => {
    return async (dispatch: any, getState: any) => {
        const prev = getState()[adaptor.slice]
        const data = { ...prev, ...update }

        await adaptor.save()

        dispatch({ type: UPDATE, data, slice: adaptor.slice })
    }
}

// export const edit = (adaptor: any, update: any = {}) => {
//     return async (dispatch: any, getState: any) => {
//         const prev = getState()[adaptor.slice]
//         const data = { ...prev, ...update }

//         await adaptor.save()

//         dispatch({ type: UPDATE, data, slice: adaptor.slice })
//     }
// }

export const select = (adaptor: any, id: string) => {
    return async (dispatch: any, getState: any) => {
        const prev = getState()[adaptor.slice]
        const data = { ...prev, ...update }

        const row = await adaptor._loadTableRow(id)
        data.selection = { ...row }

        await adaptor.save()

        dispatch({ type: UPDATE, data, slice: adaptor.slice })
    }
}

export const deselect = (adaptor: any) => {
    return async (dispatch: any, getState: any) => {
        const prev = getState()[adaptor.slice]
        const data = { ...prev }

        data.selection && delete data.selection

        dispatch({ type: UPDATE, data, slice: adaptor.slice })        
    }
}

export const updateSelected = (adaptor: any, update: any = {}) => {
    return async (dispatch: any, getState: any) => {
        const prev = getState()[adaptor.slice]
        const data = { ...prev }

        data.selection = { ...data.selection, ...update }
        await adaptor.save()

        dispatch({ type: UPDATE, data, slice: adaptor.slice })
    }
}

export const updateBlob = (adaptor: any, id: string, update: any = {}) => {
    return async (dispatch: any, getState: any) => {
        const prev = getState()[adaptor.slice]
        const data = { ...prev, ...update, dirty: true }
        
        const { type, content } = data
        
        await adaptor.session.cache.put(`blobs/${id}`, { type, content })

        dispatch({ type: UPDATE_BLOB, data, id, slice: adaptor.slice })
    }
}

export const push = (adaptor: any, id: string, update: any = {}) => {
    console.log("pushing")
    return async (dispatch: any, getState: any) => {
        const prev = getState()[adaptor.slice]

        const row = await adaptor._loadTableRow(id)
        const fresh = { ...row, update }

        const latestPush = await adaptor.session.node.push(`data:${adaptor.slice}:${id}`, row)

        console.log(latestPush)

        const data = { ...prev, ...fresh, latestPush }

        // await adaptor.save()

        // dispatch({ type: UPDATE, data, slice: adaptor.slice })
        // const results = await Promise.all(dirtyItems.map((item: any) => {
        //     LOG(`pushed data slice item [slice=${this.slice} item=${item.id}]`)
        //     this._updateTableRow(item.id, { dirty: false })
        //     return this.session.node.push(`data:${this.slice}:${item.id}`, item)
        // }))

        // const { blobs } = prev

        // if (blobs) {
        //     const itemBlobs = Object.keys(blobs).filter((blobId: string) => {
        //             console.log(blobId, blobs[blobId])
        //     })
        // }

        // const blobRevisions = await Promise.all((item.blobs || []).map((blob: string) => {
        //     return adaptor.session.node.push(`data:${adaptor.slice}:${item.id}:${blob}`, item)
        // }))

        // console.log(blobRevisions)

        // //     Object.keys(blobs).map((blobId: string) => {
        // //         console.log(blobId, blobs[blobId])
        // //     })

        // const { cid, size, timestamp } = await adaptor.session.node.push(`data:${adaptor.slice}:${item.id}`, item)
        // if (!cid) return

        // const data = { ...prev }
        // data.revisions = data.revisions || []
        // data.revisions.push({ timestamp, cid, size, revision: data.revisions.length })

        // console.log(data)

        dispatch({ type: UPDATE, data, slice: adaptor.slice })
    }
}