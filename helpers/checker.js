class Checker {
  async url(string) {
    try {
      string = string.replace(/  +/g, " ")
      return string.match(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
      )
    } catch (e) {
      console.log(e)
    }
  }

  async phone(string) {
    try {
      string = string.replace(/  +/g, " ")
      return string.match(
        /(\+*)[- _]*\(?[- _]*(\d{3}[- _]*\)?([- _]*\d){7}|\d\d[- _]*\d\d[- _]*\)?([- _]*\d){6})/g
      )
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Checker
