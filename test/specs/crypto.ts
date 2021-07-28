import savor, {
    Context, 
    Completion
  } from 'savor'

  
  savor.
  
  add('create a new account', (context: Context, done: Completion) => {
    const crypto = require('../../src/hooks/crypto')
    const id = crypto.createIdentity("test", "test")


    done()
  }).

  run('[Carmel JS] Carmel')