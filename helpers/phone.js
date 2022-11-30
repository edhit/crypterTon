const match = async phone => {
  try {
    phone = phone.replace(/  +/g, ' ');
    return phone.match(/(\+*)[- _]*\(?[- _]*(\d{3}[- _]*\)?([- _]*\d){7}|\d\d[- _]*\d\d[- _]*\)?([- _]*\d){6})/g)
  } catch (e) {
    console.log(e);
  }
}

module.exports = { match }
