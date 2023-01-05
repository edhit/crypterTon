class Sort {
  async product(string = false) {
    try {
      let obj
      switch (string) {
        case "createdAtDesc":
          obj = { createdAt: "desc" }
          break
        case "createdAtAsc":
          obj = { createdAt: "asc" }
          break
        default:
          obj = { createdAt: "desc" }
      }
      return obj
    } catch (e) {
      console.log(e)
    }
  }

  async orders(string = false) {
    try {
      let obj
      switch (string) {
        case "all":
          obj = [1, 2, 3, 4, 5]
          break
        case "paid":
          obj = 1
          break
        case "new":
          obj = 2
          break
        case "sent":
          obj = 3
          break
        case "success":
          obj = 4
          break
        case "canceled":
          obj = 5
          break
        default:
          obj = [1, 2, 3, 4, 5]
      }
      return obj
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Sort
