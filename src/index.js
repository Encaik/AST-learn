const acorn = require("acorn");

const code =
  `
  function add(a, b) {
    return a + b;
  }
  `

const res = acorn.parse(code);

for(const rootAttr in res){
  console.log(root)
}
