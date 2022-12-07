require("dotenv").config()
const TonWeb = require("tonweb")
const tonMnemonic = require("tonweb-mnemonic")
const tonweb = new TonWeb(
  new TonWeb.HttpProvider(process.env.TONCOIN, {
    apiKey: process.env.TONCOIN_API,
  })
)

const getBalance = async address => {
  try {
    return await tonweb.getBalance(address)
  } catch (e) {
    console.log(e)
  }
}

const createWallet = async (words = false) => {
  try {
    words = words == false ? await tonMnemonic.generateMnemonic() : words

    let seed = await tonMnemonic.mnemonicToSeed(words)

    let keyPair = await TonWeb.utils.nacl.sign.keyPair.fromSeed(seed)
    let wallet = tonweb.wallet.create({ publicKey: keyPair.publicKey })
    wallet = await wallet.getAddress()

    return {
      wallet: wallet.toString(true, true, true),
      hexSecret: TonWeb.utils.bytesToHex(keyPair.secretKey),
      hexPublic: TonWeb.utils.bytesToHex(keyPair.publicKey),
      words: words,
    }
    // console.log(TonWeb.utils.bytesToHex(keyPair));
    // console.log(TonWeb.utils.bytesToHex(keyPair.publicKey));
    // console.log(TonWeb.utils.bytesToHex(keyPair.secretKey));
  } catch (e) {
    console.log(e)
  }
}

const transfer = async (keyPair, toAddress, amount, payload) => {
  try {
    let wallet = tonweb.wallet.create({
      publicKey: keyPair.publicKey,
    })

    let seqno = await wallet.methods.seqno().call()
    let transfer = wallet.methods.transfer({
      secretKey: keyPair.secretKey,
      toAddress: toAddress,
      amount: tonweb.utils.toNano(amount.toString()), // 0.01 TON
      seqno: seqno,
      payload: payload,
      sendMode: 3,
    })
    return transfer
  } catch (e) {
    console.log(e)
  }
}

const estimateFee = async transfer => {
  try {
    return await transfer.estimateFee() // get estimate fee of transfer
  } catch (e) {
    console.log(e)
  }
}

// const createWallet = async (keyPair) => {
//   try {
//     let tonweb = new TonWeb();
//
//     let WalletClass = tonweb.wallet.all.v3R2;
//
//     let wallet = new WalletClass(tonweb.provider, {
//         publicKey: keyPair.publicKey
//     });
//
//     let address = await wallet.getAddress();
//
//     return address.toString(true, true, true)
//   } catch (e) {
//     console.log(e);
//   }
// }

module.exports = {
  getBalance,
  createWallet,
  transfer,
}
