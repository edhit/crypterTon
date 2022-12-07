var glob = require("glob")

var files = glob.sync("./database/models/**/*.js")

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

var func = function (files) {
  let exception = ["index"]
  for (var i = 0; i < files.length; i++) {
    files[i] = files[i].replace("./database/models/", "")
    files[i] = files[i].replace(".js", "")
    // console.log(files[i]);
    if (!exception.includes(files[i])) {
      files[i] = capitalizeFirstLetter(files[i])
      exports[files[i].replace("/", "_")] = require("./" + files[i])
    }
  }
}

func(files)
