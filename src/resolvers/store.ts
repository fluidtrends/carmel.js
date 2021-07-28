import { createHashHistory, createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import thunk from 'redux-thunk'
import * as reducers from './reducers'

export const resolveState = (session: any, route: any) : any => {
    return (state: any) => {
        const data: any = { } 
    
        Object.keys(route.data).map((slice: string) => {
              data[slice] = session.data[slice]._updateState(state[slice])
        })
    
        return { ...route, data }
    }  
}

export const resolveStore = (data: any = {}): any => {
    const history = createBrowserHistory()
    const dataReducers: any = {}

    Object.keys(data).map((k: string) => {
        dataReducers[k] = reducers.main(k)
    })

    const combinedReducers = combineReducers({ ...dataReducers, router: connectRouter(history) })
    const persistedReducer = persistReducer({ 
        key: 'carmelroot', 
        storage, 
        stateReconciler: (autoMergeLevel2 as any)
    }, combinedReducers)
 
    const store: any = createStore(persistedReducer, applyMiddleware(thunk))
    const persistor = persistStore(store)

    return { store, persistor, history }    
}