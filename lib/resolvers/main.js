"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWeb = exports.resolve = exports.resolveChunkComponent = exports.resolveChunkManifest = void 0;
const react_router_dom_1 = require("react-router-dom");
const resolveChunkManifest = (chunk) => {
    try {
        return require(`carmel/chunks/${chunk}/chunk.json`);
    }
    catch (_a) { }
};
exports.resolveChunkManifest = resolveChunkManifest;
const resolveChunkComponent = (chunk, id, target = 'web') => {
    try {
        const componentFile = `${id}${target === 'web' ? '' : '.' + target}`;
        const component = react_router_dom_1.withRouter(require(`carmel/chunks/${chunk}/components/${componentFile}`));
        return component.default;
    }
    catch (_a) {
    }
};
exports.resolveChunkComponent = resolveChunkComponent;
const resolve = (target) => {
    const config = require('.carmel.json');
    let chunks = {};
    let routes = [];
    config.chunks.map((chunkId) => {
        const chunkConfig = exports.resolveChunkManifest(chunkId);
        let chunkRoutes = chunkConfig.routes || [];
        let chunkComponents = {};
        chunkRoutes = chunkRoutes.map((route) => {
            const path = `${chunkConfig.path}${route.path.substring(1)}`;
            let components = [];
            route.components.map((component) => {
                const componentId = (typeof component === 'string' ? component : component.id);
                chunkComponents[componentId] = chunkComponents[componentId] || exports.resolveChunkComponent(chunkId, componentId, target);
                components.push(chunkComponents[componentId] || component);
            });
            return Object.assign({}, route, {
                chunk: chunkId,
                path,
                id: `${chunkId}/${route.id}`,
                resolvedPath: route.variant ? `${path}(/:${route.variant})*` : path,
                components
            });
        });
        routes = routes.concat(chunkRoutes);
        const chunk = Object.assign(Object.assign({ id: chunkId }, chunkConfig), { routes: chunkRoutes, components: chunkComponents });
        chunks[chunkId] = chunk;
    });
    const publicRoutes = routes.filter((r) => !r.isPrivate);
    const privateRoutes = routes.filter((r) => r.isPrivate);
    return Object.assign(Object.assign({}, config), { chunks, routes: { all: routes, public: publicRoutes, private: privateRoutes } });
};
exports.resolve = resolve;
const resolveWeb = () => {
    return exports.resolve('web');
};
exports.resolveWeb = resolveWeb;
//# sourceMappingURL=main.js.map