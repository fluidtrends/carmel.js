import { 
  UPDATE,
  UPDATE_BLOB
} from './actions'

export const main = (slice: string) => (state: any = {}, action: any) => {  
  if (action.slice !== slice) return state 
  
  switch(action.type) {
    case UPDATE_BLOB:
      state.blobs = state.blobs || {}
      state.blobs[action.id] = `blob:${action.data.type}`
      break
    case UPDATE:
      return action.data
    default:
  }
 
  return state
}