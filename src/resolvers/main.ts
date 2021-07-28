import { withRouter } from 'react-router-dom'
import { resolveStore } from './store'

export const resolveChunkManifest = (chunk: string) => {
    try {
        return require(`carmel/chunks/${chunk}/chunk.json`)
    } catch {}
} 

export const resolveChunkComponent = (chunk: string, id: string, target: string = 'web') => {
    try {
        const componentFile = `${id}${target === 'web' ? '' : '.' + target}`
        const component: any = withRouter(require(`carmel/chunks/${chunk}/components/${componentFile}`))
        return component.default
    } catch {
    }
}

export const resolveChunks = (config: any, target: string) => {
    let chunks: any = {}
    let routes: any = []
    let data: any = {}

    config.chunks.map((chunkId: string) => {      
        const chunkConfig = resolveChunkManifest(chunkId)
        let chunkRoutes = chunkConfig.routes || []
        let chunkComponents: any = {}

        data = { ...data, ...chunkConfig.data }

        chunkRoutes = chunkRoutes.map((route: any) => {
            const path = `${chunkConfig.path}${route.path === '/' ? '' : route.path}`
            let components: any = []

            route.components.map((component: any) => {
                const componentId = (typeof component === 'string' ? component : component.id)
                chunkComponents[componentId] = chunkComponents[componentId] || resolveChunkComponent(chunkId, componentId, target)
                components.push(chunkComponents[componentId] || component)
            })

            data = { ...data, ...route.data }

            const routeId = `${chunkId}/${route.id}`

            return Object.assign({}, route, {
                chunk: chunkId,
                path,
                id: routeId,
                resolvedPath: route.variant ? `${path}(/:${route.variant})*` : path,
                components
            })
        })
        
        routes = routes.concat(chunkRoutes)
        const chunk = { id: chunkId, ...chunkConfig, routes: chunkRoutes, components: chunkComponents }
        chunks[chunkId] = chunk
    })

    return { chunks, routes, data }
}

export const resolve = (target: string) => {
    const config: any = require('.carmel.json')

    const { data, chunks, routes } = resolveChunks(config, target)
    const { store, history, persistor } = resolveStore(data)

    const publicRoutes = routes.filter((r: any) => !r.isPrivate)
    const privateRoutes = routes.filter((r: any) => r.isPrivate)
    
    return { ...config, data, store, history, persistor, chunks, routes: { all: routes, public: publicRoutes, private: privateRoutes } }
}

export const resolveWeb = () => {
    console.log("**22222222*@@@@@@@@@******")
    return resolve('web')
}
