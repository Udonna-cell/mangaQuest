const shelljs = require("shelljs")

function clean(){
    shelljs.exec("rm -fr *.{pdf,jpg}")
}

module.exports = clean