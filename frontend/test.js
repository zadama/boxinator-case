const { ntc } = require("./ntc");

var n_match = ntc.name("#34eb86");
var n_name = n_match[1]; // This is the text string for the name of the match

console.log(n_name);
