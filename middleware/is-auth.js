const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decoderToken;
    try {
        decoderToken = jwt.verify(token, 'secretsecretsecretsecret');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decoderToken){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decoderToken.userId;
    next();
}