import { add, subtract, multiply } from './utils/math.js';
import capitalize from './utils/strings.js';
console.log(add(5, 3));
console.log(subtract(10, 4));
console.log(multiply(2, 6));
console.log(capitalize("hello"));

console.log(import.meta.url);
// import.meta.url replaces __filename in ESM to give the path of the current file.
