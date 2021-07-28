import savor, {
    Context, 
    Completion
  } from 'savor'
  import bs58 from 'bs58'
  import verifier from 'bitcoinjs-message'
  import wif from 'wif'
  import { Identity, Wallet } from '../../src'
  import * as bitcoin from 'bitcoinjs-lib'
  
  savor.
  
  add('create a datastore', (context: Context, done: Completion) => {
    const mnemonic = "pistol knife novel chimney grain sauce catch height sunset napkin almost oven rely gaze boring absorb glass pipe mention vivid awesome puzzle elbow discover"
    const xprv = "xprv9s21ZrQH143K2y4H8qeTFtfhAwL6aFmfBwZ9jhQ8JqGSSnig8Jhkjuno8j5jHpiZtNYDtGmow9gCvtj3z4chhbaDamR2kSEw6xipMF92QKr"
    // const wallet = new Wallet(mnemonic)  
    // const identity = wallet.getIdentity()
    // // const store = new Datastore(identity)

    // console.log("init:", store.raw)

    // savor.promiseShouldSucceed(store.addRow("me", { one: "two" }, "more me"), done, (data: any) => {
    //     console.log(">", data)
    //     const all = store.save()
    //     console.log(all)
    // })

    // const id = store.addRow("posts", { title: "first" }, "new post")
    // const id2 = store.addRow("posts", { title: "second" }, "new post2")

    // store.raw.posts.map((post: any) => {
    //     console.log(post)
    // })

    done()
  }).

  add('load a datastore', (context: Context, done: Completion) => {
    const mnemonic = "pistol knife novel chimney grain sauce catch height sunset napkin almost oven rely gaze boring absorb glass pipe mention vivid awesome puzzle elbow discover"
    const xprv = "xprv9s21ZrQH143K2y4H8qeTFtfhAwL6aFmfBwZ9jhQ8JqGSSnig8Jhkjuno8j5jHpiZtNYDtGmow9gCvtj3z4chhbaDamR2kSEw6xipMF92QKr"
    // const wallet = new Wallet(mnemonic)  
    // const identity = wallet.getIdentity()
    // const store = new Datastore(identity)

    // const content = "PM7jjgJtEAd9YVzf3snrULs1Y7MTnNByRVLSoMqKgWghgQGaiMMf7nFNXRm6igUDyh6MaoVZc6LBv7YifNaumVrabU776vRyRZPqTHiYEuzGvUXivDUUWTBKCdJeNwmsgxGVBX4TVVHJ1FSgcwA7vw1jHJZ89RbNSBBuJ2pvCS65wiGb8eGbwFjh7Arf6QEBeZpbwDiXXmtPkcYEQgqqq5Fxi45LDGhaJp6fW98s6eDsZnKFh6GTXQhzh5h8arDbAj8XtzpaokXWR7SfDY6vN2yAVqe2qQL9ZR2nXUmG1zLG1wpRfyTNn2aw282RKjBVat1H27to3Z4Dzf81TgJBwegxjKZiJbqAe8TPJzw3fcjKEXqBJeFijaNE3TJQ2GBRBbfsoVPPjd5tJNCz5jsM9CM1Pcu3jzwaWFD82BT1pEuWSD4NTC8QQ2fPvLTngHg5FqpPrMgFtz97r1CwpvuURjWho5iFgLfDVw7LqPqhZw5UntoBE8LQvdA6i42a9dfxnXakXbd8brKEnDxZFE4zqLunNDiqigtuiREHaqwDxaEP7SSEj1hzki3VTwpueCntKr41hKoL69USZxZfv79kNfNRHbvVMdmFUxMyYMgSnjk9V55oHkvTaUkzci9zaBkGofR1eTRwLcjguh2VGCtz3ZsFZbCFCsux2cQKqshr59VWrw8fatdnSxDPDDmEhKoQAsgWCLiaYAaod4Nep7W5XzbBey4azthEdBiDWmQjZDKLKt599Gj3J1Ei4ySr7ieaNF6ShKwsnTgWY3oybrHP6X56Drjoy3uurac1kFMa3GwoK1FEMnUo2R74ZdMY8qgLHFSPpFiMbDwsUdNtCus4yeGNFE68AukULzUrefwC6C3WkKHr3nWtanMRu7MUeHZMD6ZPVfHFVQruss7PcZmGTJqwrnSmLUuNGb1no3MpBTQfAooBuJGRngXMBJ5Cr3L63RodrhPZbaR4qh2MEx9U4ah1P26aAXBaqXnXMhQA3G8mEPzp8Pq7Lb3k86zrpvNB3ReNCjktxskEExNwBJw96i7Q9do6HGV32"
    // store.load(content)
    // // console.log(store.save())
    done()
}).

  run('[Carmel JS] Datastore')