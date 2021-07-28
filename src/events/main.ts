import { Session } from '..'

export const accept = async (session: Session, event: any) => {
    // const { settings } = session.config

    // let carmel: any = {
    //     cid: session.node.cid,
    //     isBrowser: session.node.isBrowser,
    //     connected: session.node.connected
    // } 

    // if (settings && settings.eosUrl && settings.eosUsername && settings.eosAccountName) {
    //     carmel.username = settings.eosUsername
    //     carmel.eosAccountName = settings.eosAccountName
    //     carmel.eosUrl = settings.eosUrl
    // }
    
    // return {
    //     peer: session.node.cid, 
    //     carmel
    // }
}

export const accept_result = async (session: Session, event: any) => {
    // event.peer === session.node.cid || session.node.addPeer(event)
}