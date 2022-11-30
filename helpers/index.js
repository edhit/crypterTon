var glob = require("glob")

var files = glob.sync("./helpers/**/*.js");

var func = function(files) {
  let exception = ['index'];
  for (var i = 0; i < files.length; i++) {
    files[i] = files[i].replace('./helpers/', '');
    files[i] = files[i].replace('.js', '');
    // console.log(files[i]);
    if (!exception.includes(files[i])) {
      exports[files[i].replace('/', '_')] = require('./' + files[i]);
    }
  }
}

func(files);
