var { parse } = require("@babel/parser");
var fs = require("fs");

fs.readFile("./parcode.js", "utf-8", (err, data) => {
  if (err) {
    throw err;
  }
  var res = parse(data);
  fs.writeFile("./ast.json", JSON.stringify(res), "utf-8", function (err) {
    if (err) {
      throw err;
    }
  });
});
