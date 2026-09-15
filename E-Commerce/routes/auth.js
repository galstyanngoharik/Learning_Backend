require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { readData, writeData } = require('../utils/fileDB');

const SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    const users = readData('users.json');
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    if(users.find(u => u.username === username)) {
        return res.status(409).json({ error: "Username already exists" });
    }
    const newUser = {
        id: users.length ? users[users.length-1].id + 1 : 1,
        username,
        passwordHash: await bcrypt.hash(password, 10),
        role: 'customer'
    };
    users.push(newUser);
    writeData('users.json', users);

    return res.status(201).json({id: newUser.id, username: newUser.username, role: newUser.role});
});

router.post('/login', async(req, res) => {
    const users = readData('users.json');
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if(!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: "invalid username or password"});
    }
   
    const token = jwt.sign(
        {
           id: user.id,
           username: user.username,
           role: user.role 
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );
    res.status(200).json({ token });        
});

module.exports = router;