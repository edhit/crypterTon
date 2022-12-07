const status = async (status = false) => {
  return ["published", "oncheck", "deleted"]
}

const statusOrder = async (statusOrder = false) => {
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

const statusPayment = async (statusPayment = false) => {
  return ["not_paid", "paid", "returned"]
}

const check = async (check = false) => {
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

const currency = async (currency = false) => {
  return ["rub", "usd", "gbp", "try"]
}

const crypto = async (crypto = false) => {
  return ["bitcoin", "the-open-network", "usd"]
}

const language = async (language = false) => {
  return ["rus", "eng"]
}

const role = async (role = false) => {
  return ["user", "admin"]
}

module.exports = {
  status,
  statusOrder,
  check,
  currency,
  crypto,
  language,
  role,
}
