import { Session } from '..'

export const create_account = async (session: Session, event: any) => {
    return session.chain.createNewAccount(event)
}

export const create_account_result = async (session: Session, event: any) => {
    event.data.account && await session.saveAccount(event.data.account)
}

export const update_account = async (session: Session, event: any) => {
    return session.chain.updateAccount(event)
}

export const update_account_result = async (session: Session, event: any) => {
    event.data.account && await session.saveAccount(event.data.account)
}