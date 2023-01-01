require("dotenv").config()
const TonWeb = require("tonweb")
const tonweb = new TonWeb(
  new TonWeb.HttpProvider(process.env.TONCOIN, {
    apiKey: process.env.TONCOIN_API,
  })
)

class Payments {
  async getBalance(address) {
    try {
      return await tonweb.getBalance(address)
    } catch (e) {
      console.log(e)
    }
  }

  async getTransactions(address) {
    try {
      return await tonweb.provider.getTransactions(address, 10)
    } catch (e) {
      console.log(e)
    }
  }

  async createWallet() {
    try {
      let nacl = TonWeb.utils.nacl
      let keyPair = nacl.sign.keyPair()
      let wallet = await tonweb.wallet.create({ publicKey: keyPair.publicKey })
      wallet = await wallet.getAddress()

      return {
        wallet: wallet.toString(true, true, true),
        hexSecret: TonWeb.utils.bytesToHex(keyPair.secretKey),
        hexPublic: TonWeb.utils.bytesToHex(keyPair.publicKey),
      }
      // console.log(TonWeb.utils.bytesToHex(keyPair));
      // console.log(TonWeb.utils.bytesToHex(keyPair.publicKey));
      // console.log(TonWeb.utils.bytesToHex(keyPair.secretKey));
    } catch (e) {
      console.log(e)
    }
  }

  async transfer(keyPair, toAddress, amount, payload) {
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

  async estimateFee(transfer) {
    try {
      return await transfer.estimateFee()
    } catch (e) {
      console.log(e)
    }
  }

  async toNano(amount) {
    try {
      return TonWeb.utils.toNano(amount.toString())
    } catch (e) {
      console.log(e)
    }
  }

  async fromNano(amount) {
    try {
      return TonWeb.utils.fromNano(amount.toString())
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Payments
