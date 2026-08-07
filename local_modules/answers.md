
### 1. In the CommonJS version, if you had written exports = { add, subtract,
multiply } instead of individually attaching each function to exports , what
would happen when you require() that file from index.js ? Why?

**Answer:**
if we write:
exports = { add, subtract, multiply };
require() will get an empty object {}.
This happens because we give exports a new object, but module.exports does not change. require() returns module.exports.

### 2. Why does utils/strings.js in the CJS folder use module.exports = ... while
utils/math.js uses exports.xxx = ... ? Could you have written math.js
using module.exports instead? What would change on the importing side?

**Answer:**
strings.js uses module.exports because it exports the whole value at once.
math.js uses exports.xxx to add functions one by one.

Yes, we could also write:
module.exports = { add, subtract, multiply };
Nothing would change when importing it.

### 3. In the ESM version, why is the exact file extension required on import
'./utils/math.js' , when the CJS version works fine with
require('./utils/math') ?

**Answer:**
ESM needs .js because Node.js does not add the extension automatically.


### 4. Name one thing ES Modules can do that CommonJS cannot, and explain briefly
why the difference exists (hint: think about how each system loads files —
synchronously vs. not).

**Answer:**
ES Modules support Top-Level await
CommonJS cannot use await at the top level in the same way.
This is because require() is synchronous, while ES Modules support asynchronous module loading.