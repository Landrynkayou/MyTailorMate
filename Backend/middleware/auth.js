const jwt = require('jsonwebtoken');
const dotenv = require('dotenv-flow');
dotenv.config(); // Load environment variables
const JWT_SECRET = process.env.JWT_TOKEN_KEY; 
const auth = (req, res, next) => {
    // Extract token from headers, query params, or body
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // Check for authorization header and extract token
    const authHeader = req.headers.authorization;
    if (authHeader) {
        token = authHeader.split(' ')[1]; // Assumes 'Bearer <token>'
    }

    if (!token) {
        return res.status(403).json({ message: 'Unauthorized access token needed' });
    }

    try {
        // Verify the token
        const decodedUserPayload = jwt.verify(token, JWT_SECRET);
        req.user = decodedUserPayload; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Access denied.' });
        } else {
            return res.status(500).json({ message: 'Internal server error during token verification.' });
        }
    }
};

module.exports = auth;
