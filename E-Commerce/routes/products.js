const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/fileDB');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');



module.exports = router;

router.get('/', (req, res) => {
    let products = readData('products.json');
    if(req.query.category) {
        products = products.filter(p => p.category === req.query.category);
    }
    if(req.query.sort === 'price') {
        products.sort((a,b) => a.price-b.price);
    }
    res.status(200).json(products);

});

router.get('/:id', (req, res) => {
    const products = readData('products.json');
    const product = products.find(p => p.id === Number(req.params.id));
    if(!product) {
        return res.status(404).json({ error: "product not found" });
    } 
    return res.status(200).json(product);
});

router.post('/', authenticate, authorize('admin'), (req, res) => {
    const products = readData('products.json');
    const { name, price, category, stock } = req.body;
    if(!name || !price) {
        return res.status(400).json({ error: "name and price are required" });
    }
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        name,
        price,
        category: category || "General",
        stock: stock !== undefined ? stock : 0
    }
    products.push(newProduct);
    writeData('products.json', products);
    res.status(201).json(newProduct);
});

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
    const products = readData('products.json');
    const product = products.find(p => p.id === Number(req.params.id));
    if(!product) {
        return res.status(404).json({ error: "product not found" });
    }
   
        product.name = req.body.name ?? product.name;
        product.price = req.body.price ?? product.price;
        product.category = req.body.category ?? product.category;
        product.stock =  req.body.stock ?? product.stock;
  
    writeData('products.json', products);
    res.status(200).json(product);
});

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
    const products = readData('products.json');
    const productid = Number(req.params.id);
    const product = products.find(p => p.id === productid);
    if(!product) {
        return res.status(404).json({ error: "product not found" });
    }  
    const newProducts = products.filter(p => p.id !== productid);
    writeData('products.json', newProducts);
    res.status(204).send();
});