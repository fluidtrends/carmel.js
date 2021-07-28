"use strict";
const randomBytes = require('randombytes');
const wif = require('wif');
const { BIP32Interface, fromSeed, fromPrivateKey } = require('bip32');
const { encrypt, decrypt } = require('bip38');
const { entropyToMnemonic, mnemonicToSeedSync } = require('bip39');
const bs58 = require('bs58');
const ecc = require('eosjs-ecc');
const generateMnemonic = () => {
    return entropyToMnemonic(randomBytes(32));
};
const generateSignature = ({ password, privateKey }) => {
    const decoded = wif.decode(privateKey, 128);
    return encrypt(decoded.privateKey, true, password);
};
module.exports = {
    generateMnemonic, generateSignature
};
//# sourceMappingURL=crypto.js.map