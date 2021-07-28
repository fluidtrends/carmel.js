import savor, {
    Context, 
    Completion
  } from 'savor'

import { Chain } from '../../src'

const CONFIG = {
    "username": "chunkymonkey",
    "eos": {
        "chainUrl": "http://0.0.0.0:8888",
        "accountName": "chunkymonkey",
        "ownerPublicKey": "EOS64D9jbWvBVKE1a7BU55cQJwzZ7CwaMGX3G4YdEHYm1MtKvDLMo",
        "activePublicKey": "EOS6rvm5yrYX7FPi9ynyd4vYZ2NYMsi652M9ff1oNEWM3kpiUS5Zi",
        "ownerPrivateKey": "5HtywUQp3uYrYkR7wFzhBQqGsRqvCP1RA7VqAMPgNee41YxhQBU",
        "activePrivateKey": "L5kTBcg5Y9UKw1Dss5DzPAvorwgYTFiYupLxxqetyEDDMkrTqRX1"
    }
}

// const CONFIG = {
//     "username": "chunkymonkey",
//     "eos": {
//         "chainUrl": "https://jungle3.cryptolions.io:443",
//         "accountName": "chunkymonkey",
//         "ownerPublicKey": "EOS64D9jbWvBVKE1a7BU55cQJwzZ7CwaMGX3G4YdEHYm1MtKvDLMo",
//         "activePublicKey": "EOS6rvm5yrYX7FPi9ynyd4vYZ2NYMsi652M9ff1oNEWM3kpiUS5Zi",
//         "ownerPrivateKey": "5HtywUQp3uYrYkR7wFzhBQqGsRqvCP1RA7VqAMPgNee41YxhQBU",
//         "activePrivateKey": "5JPE8c9xUD9TLzUm1HMbGQneyS8cCX181pf8yqMMJ1bjNoDV82h"
//     }
// }

savor.

add('send a transaction', (context: Context, done: Completion) => {
//     publicKey: EOS8jtWcry9GfgEiddshM9Br1uX4ztnh46Ve6u8NTprEw8VGHRHY4
// privateKey: L5kTBcg5Y9UKw1Dss5DzPAvorwgYTFiYupLxxqetyEDDMkrTqRX1
// digest: test
// signature: SIG_K1_K5FUtqDwRGtpteJhJB83aecSorPUZzQWhG823dnbJq4zE5i6TRhLc1d89oP5VJ6jSNkCkLeDPpYepPGdFtGuNA5ZhtUT6h
    // const account = {
    //     username: "account13",
    //     publicKey: "EOS8jtWcry9GfgEiddshM9Br1uX4ztnh46Ve6u8NTprEw8VGHRHY4",
    //     did: "did:carmel:account0"
    // }

    // const chain = new Chain(CONFIG)
    // savor.promiseShouldSucceed(chain.createNewAccount(account), done, (data: any) => {
    //     console.log(data)
    // })
    done()
}).

run('[Carmel JS] Chain')