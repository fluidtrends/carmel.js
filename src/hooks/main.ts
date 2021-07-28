import { useEffect, useState } from 'react'
import { Session, EVENT, SESSION_STATUS } from '..'
import { encrypt, decrypt } from 'bip38'
import bs58 from 'bs58'
import debug from 'debug'

const LOG = debug('carmel:hooks')

export const useCarmel = (config: any, dispatch: any) => {
  const [session, setSession] = useState<any>()
  const [node, setNode] = useState<any>()
  const [loggedIn, setLoggedIn] = useState(false)
  const [ready, setReady] = useState(false)
  const [events, setEvents] = useState<any>([])
  const [newEvent, setNewEvent] = useState<any>()
  const [newIdentity, setNewIdentity] = useState<any>()
  const [user, setUser] = useState<any>()
  const [authenticating, setAuthenticating] = useState<any>(false)
  const [account, setAccount] = useState<any>()

  const worker = new Worker('../workers/main.js', { type: 'module' })

  const onNewEvent = (e: any) => {
      switch(e.type) {
        case EVENT.CONNECTED:
          return
        case EVENT.DATA_CHANGED:
          // setData({ _timestamp: Date.now(), ...session.data })
          return
        default:
      }
      
      setNewEvent(e)
  }

  worker.onmessage = async (event: any) => {
    const { type, result, data } = event.data
    const _user = user 

    LOG(`got worker message [type=${type}]`)

    switch(type) {
      case "generateMnemonic":
        const { privateKey, publicKey } = session.openWalletFromMnemonic(result).getIdentity()
        worker.postMessage({ type: "generateSignature", data: { ...data, mnemonic: result, privateKey, publicKey }})
      break
      case "generateSignature":
        await session.createAccount(data.username, data.mnemonic, result)
        onNewEvent({ type: EVENT.USER_CREATED, data: { user: { ...session.account, username: data.username, mnemonic: data.mnemonic }} })
      break
      case "decryptSignature":
        if (result.error) {
          onNewEvent({ type: EVENT.USER_LOGIN, data: { username: data.username, error: 'Authentication failed' }})
          return 
        }
        await session.createAccountFromIdentity({ ...data, ...result })
        onNewEvent({ type: EVENT.USER_LOGIN, data: { user: data }})
      break
    }
  }

  const init = async () => {
    session.listen((type: EVENT, id: string, data: any) => {
      if (events.length === 0 || events[events.length - 1].id !== id) {
        onNewEvent({ type, id, data })
      }

      events.push({ type, id, data })
    })

    await session.start()
  }

  const findUser = (username: string, login: boolean) => {
    setAuthenticating(login)
    session.findUser(username, login)
  }

  const register = (username: string, password: string) => {
    LOG(`register [username=${username}]`)

    setAuthenticating(false)
    worker.postMessage({ type: "generateMnemonic", data: { username, password } })
  }

  const login = (data: any) => {
    LOG(`login [username=${data.username}]`)

    setAuthenticating(true)

    worker.postMessage({ type: "decryptSignature", data })
  }

  const loadUser = (user: any) => {
    LOG(`loading user [username=${user.username}]`)

    session.loadUser(user)
  }

  const logout = async () => {
    await session.clearAccount()
    setAccount(undefined)
  }

  const updateAccount = async (fields: any) => {
    LOG(`updating account`)

    await session.updateAccount(fields)
  }

  const saveMnemonicToFile = (user: any) => {
    const { saveAs } = require('file-saver')
    const blob = new Blob([user.mnemonic], { type: "text/plain;charset=utf-8" })
    saveAs(blob, `${user.username}.phrase.carmel`)
  }

  const saveSignatureToFile = () => {
    const { saveAs } = require('file-saver')
    const blob = new Blob([account.signature], { type: "text/plain;charset=utf-8" })
    saveAs(blob, `${account.username}.signature.carmel`)
  }

  useEffect(() => {
    setSession(new Session(config, dispatch))
  }, [])

  useEffect(() => {
    (async () => {
      if (!session) return 
      await init()
      setAccount(session.account)
      setReady(true)
    })()
  }, [session])

  return { 
    session, 
    events, 
    findUser,
    saveMnemonicToFile, 
    saveSignatureToFile, 
    ready, 
    updateAccount, 
    logout, 
    newEvent, 
    account, 
    authenticating,
    loggedIn, 
    loadUser,
    EVENT, 
    SESSION_STATUS, 
    register, 
    login, 
    newIdentity
  }
}
