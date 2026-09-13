const express = require('express');
const app = express();
app.use(express.json());

const auth = require('./routes/auth');
const products = require('./routes/products');
const orders = require('./routes/orders');

app.use('/auth', auth);
app.use('/products', products);
app.use('/orders', orders);

app.get("/", (req, res) => { res.send("E-Commerce API is running...") });
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});