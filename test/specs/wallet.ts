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

// add('create a 256-bit Base58 entropy', (context: Context, done: Completion) => {
//   const entropy = crypto.generateBase58Entropy()
//   context.expect(entropy).to.exist
//   done()
// }).

// add('create a 24-word BIP39 mnemonic from a 256-bit Base58 entropy', (context: Context, done: Completion) => {
//   const entropy = "8RZ7UREdsX9Hs2E26JzsoiFBCuDNoEbME8pokng7Z1gC"
//   const expectedMnemonic = "hour gather panda afford romance layer limb visual insect beef popular below power pride yard pond attend focus carbon arena pony pencil various claw"
//   const mnemonic = crypto.generateMnemonicFromBase58Entropy(entropy)
//   context.expect(mnemonic).to.equal(expectedMnemonic)
//   done()
// }).

// add('create a 512-bit BIP39 seed from a 24-word BIP39 mnemonic', (context: Context, done: Completion) => {
//   const mnemonic = "hour gather panda afford romance layer limb visual insect beef popular below power pride yard pond attend focus carbon arena pony pencil various claw"
//   const expectedSeed = "4VA9R4CG8W3L7P5KxzNJ6qKogvThMA1bFJ1dzdYg7wgHwxkLGASV6m4vWoXMqPFhZzGbmVAMyf8QXQhFP3bgGwHJ"
//   const seed = crypto.generateBase58SeedFromMnemonic(mnemonic)

//   context.expect(seed).to.equal(expectedSeed)

//   done()
// }).

// add('create a new BIP32 HD Wallet', (context: Context, done: Completion) => {
//   const entropy = crypto.generateBase58Entropy()
//   const mnemonic = crypto.generateMnemonicFromBase58Entropy(entropy)
//   const seed = generateBase58SeedFromMnemonic(mnemonic)
//   const wallet = crypto.createWalletFromBase58Seed(seed)

//   context.expect(wallet).to.exist

//   done()
// }).

// add('create a BIP32 HD Wallet from a 512-bit BIP39 seed', (context: Context, done: Completion) => {
//   const seed = "4VA9R4CG8W3L7P5KxzNJ6qKogvThMA1bFJ1dzdYg7wgHwxkLGASV6m4vWoXMqPFhZzGbmVAMyf8QXQhFP3bgGwHJ"
//   const expectedId = "Db8fscjnscZFR8QGuPwPQg6zu3i"
//   const expectedFingerprint = "Q6cJV"
//   const expectedPublicKey = "hMESqbUz8dcR5f9BTkuiDdwsEGSo2yw5qGPBKy5wk9as"
//   const expectedWIF = "L5ghS9EfLMaMUkU5cZpC6CLLC27JnuBUTT9FvndX5YyHQmWHYTGx"
//   const expectedChainCode = "BSf3X1R7c9EU97P2VGHV6QMmjk7qsotzi1vGmfVdWUSJ"

//   const wallet = crypto.createWalletFromBase58Seed(seed)

//   context.expect(wallet).to.exist
//   context.expect(bs58.encode(wallet.identifier)).to.equal(expectedId)
//   context.expect(bs58.encode(wallet.fingerprint)).to.equal(expectedFingerprint)
//   context.expect(bs58.encode(wallet.publicKey)).to.equal(expectedPublicKey)
//   context.expect(bs58.encode(wallet.chainCode)).to.equal(expectedChainCode)  
//   context.expect(wallet.toWIF()).to.equal(expectedWIF)

//   // const wallet = crypto.createWalletFromBase58Seed(seed)
//   // const root = wallet.derivePath("m/44'/0'/0'")

//   // const walletKH = bitcoin.payments.p2pkh({ pubkey: wallet.publicKey })
//   // const rootKH = bitcoin.payments.p2pkh({ pubkey: root.publicKey })

//   // console.log()
//   // console.log("wallet address", walletKH.address)
//   // console.log("wallet publicKey", Buffer.from(wallet.publicKey).toString('hex'))
//   // console.log("wallet wif", wallet.toWIF())
//   // console.log("wallet privateKey", Buffer.from(wif.decode(wallet.toWIF()).privateKey).toString('hex'))
//   // console.log("wallet xpub", wallet.neutered().toBase58())
//   // console.log("wallet xprv", wallet.toBase58())

//   // console.log()
//   // console.log("root address", rootKH.address)
//   // console.log("root publicKey", Buffer.from(root.publicKey).toString('hex'))
//   // console.log("root privateKey", Buffer.from(wif.decode(root.toWIF()).privateKey).toString('hex'))
//   // console.log("root wif", root.toWIF())
//   // console.log("root xpub", root.neutered().toBase58())
//   // console.log("root xprv", root.toBase58())

//   // const pub0 = root.neutered().derive(0)
//   // const pub1 = root.neutered().derive(1)
//   // const pub2 = root.neutered().derive(2)
  
//   // console.log()
//   // console.log("pub0", pub0.toBase58())
//   // console.log("pub1", pub1.toBase58())
//   // console.log("pub2", pub2.toBase58())
  
//   done()
// }).

// add('create a new identity', (context: Context, done: Completion) => {

//   const id = new Identity()
//   id.generate()

//   done()
// }).

add('create a new wallet', (context: Context, done: Completion) => {
  // const wallet = new Wallet()
  // context.expect(wallet.mnemonic).to.exist  

  done()
}).

add('open an existing wallet from a mnemonic', (context: Context, done: Completion) => {
  const mnemonic = "pistol knife novel chimney grain sauce catch height sunset napkin almost oven rely gaze boring absorb glass pipe mention vivid awesome puzzle elbow discover"
  const xprv = "xprv9s21ZrQH143K2y4H8qeTFtfhAwL6aFmfBwZ9jhQ8JqGSSnig8Jhkjuno8j5jHpiZtNYDtGmow9gCvtj3z4chhbaDamR2kSEw6xipMF92QKr"
  // const wallet = new Wallet(mnemonic)

  // context.expect(wallet.mnemonic).to.equal(mnemonic)
  // context.expect(wallet.xprv).to.equal(xprv)

  // const identity = wallet.getIdentity()

  done()
}).

// add('verify a message', (context: Context, done: Completion) => {

//   // crypto.generateWalletx()

//   done()
// }).

run('[Carmel JS] Wallet')