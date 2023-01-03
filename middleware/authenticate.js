// This middleware is used to autheticate the token to allow valid 
// api calls

const jst = ('jsonwebtoken')
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'temporarysecretvalue')
        req.user = decode
        next();
    }
    catch(err) {
        res.json({
            message: 'Authentication Failed!'
        })
    }
}