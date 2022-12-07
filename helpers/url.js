const match = async url => {
  try {
    url = url.replace(/  +/g, " ")
    return url.match(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
    )
  } catch (e) {
    console.log(e)
  }
}

module.exports = { match }
