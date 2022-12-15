class Status {
  async product(status = false) {
    return ["published", "oncheck", "deleted"]
  }

  async order(statusOrder = false) {
    return [
      "new",
      "onagree",
      "onprepare",
      "onprepare",
      "ondelivery",
      "success",
      "canceled",
      "returned",
    ]
  }

  async payment(statusPayment = false) {
    return ["not_paid", "paid", "returned"]
  }

  async check(check = false) {
    return [
      "ok",
      "name_phone",
      "description_phone",
      "tags_phone",
      "name_url",
      "description_url",
      "tags_url",
    ]
  }

  async currency(currency = false) {
    return ["rub", "usd", "gbp", "try"]
  }

  async coins(coins = false) {
    return ["bitcoin", "the-open-network", "usd"]
  }

  async language(language = false) {
    return ["rus", "eng"]
  }

  async role(role = false) {
    return ["user", "admin"]
  }
}

module.exports = Status
