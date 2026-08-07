const math = require('./utils/math.js');
const capitalize = require('./utils/strings.js');
console.log(math.add(1, 3));
console.log(math.subtract(5, 3));
console.log(math.multiply(7, 3));
console.log(capitalize("hello"));

console.log(require.cache);
//require.cache stores loaded modules in memory so Node.js doesn't reload them again.

