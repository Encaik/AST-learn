var generate = require("@babel/generator").default;
var fs = require("fs");

fs.readFile("./ast.json", "utf-8", (err, data) => {
  if (err) {
    throw err;
  }
  var res = generate(JSON.parse(data)).code;
  fs.writeFile("./gencode.js", res, "utf-8", function (err) {
    if (err) {
      throw err;
    }
  });
});
