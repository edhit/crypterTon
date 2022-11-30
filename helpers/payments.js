require('dotenv').config()
const TonWeb = require('tonweb');
const tonMnemonic = require("tonweb-mnemonic");
const tonweb = new TonWeb(/*new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: process.env.APITON}*/);

const getBalance = async address => {
  try {
    return await tonweb.getBalance(address);
  } catch (e) {
    console.log(e);
  }
}

const createKeyPair = async (words = false) => {
  try {
    words = (words == false) ? await tonMnemonic.generateMnemonic() : words

    let seed = await tonMnemonic.mnemonicToSeed(words);

    let keyPair = await TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);

    console.log(words);
    // console.log(TonWeb.utils.bytesToHex(keyPair));
    // console.log(TonWeb.utils.bytesToHex(keyPair.publicKey));
    // console.log(TonWeb.utils.bytesToHex(keyPair.secretKey));

    return {
      keyPair: keyPair,
      words: words
    }
  } catch (e) {
    console.log(e);
  }
}

const createWallet = async (keyPair) => {
  try {
    let tonweb = new TonWeb();

    let WalletClass = tonweb.wallet.all.v3R2;

    let wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey
    });

    let address = await wallet.getAddress();

    return address.toString(true, true, true)
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getBalance,
  createKeyPair,
  createWallet
}
