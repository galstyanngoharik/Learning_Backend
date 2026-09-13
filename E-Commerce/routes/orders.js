const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/fileDB');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, (req, res) => {
    const { items } = req.body;
    if(!items) {
        return res.status(400).json({ error: "Items array is required" });
    }
    const products = readData('products.json');
    let totalPrice = 0;
    for(const item of items) {
        const product = products.find(p => p.id === item.productId);
        if(!product) {
            return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
        }
        if(product.stock < item.quantity) {
            return res.status(404).json({ error: `Not enough stock for product: ${product.name}` });
        }
        product.stock -= items.quantity;
        totalPrice += product.price * items.quantity;
    }
    const orders = readData('orders.json');
    const newOrder = {
        id: orders.length ? orders[orders.length-1].id + 1 : 1,
        userId: req.user.id,
        items,
        totalPrice,
        createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    writeData('orders.json', orders);
    return res.status(201).json(newOrder);
});

router.get('/', authenticate, (req, res) => {
    const orders = readData('orders.json');
    if(req.user.role === 'admin') {
        return res.status(200).json(orders);
    }
    const userOrders = orders.filter(o => o.userId === req.user.id);
    return res.status(200).json(userOrders);
});

router.get('/:id', authenticate, (req, res) => {
    const orders = readData('orders.json');
    const orderId = Number(req.params.id);
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json(order);
});

module.exports = router;