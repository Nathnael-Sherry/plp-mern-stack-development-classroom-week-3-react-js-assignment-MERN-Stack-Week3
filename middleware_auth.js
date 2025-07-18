const { ValidationError } = require('../utils/errors');

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== 'your-secret-api-key') {
        throw new ValidationError('Invalid or missing API key');
    }
    next();
};

module.exports = { authenticate };