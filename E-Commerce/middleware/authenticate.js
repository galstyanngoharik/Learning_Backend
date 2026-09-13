const jwt = require('jsonwebtoken');
const SECRET = 'your_secret_key';

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization ; 
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "missing or invalid token format" });
    }
    const token = (authHeader|| '').split(' ')[1];
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ error: "invalid or expired token" });
    }
}

module.exports = authenticate;