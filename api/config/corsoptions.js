const allowedOrigins = require("./allowed")
const corsOptions  = {
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}
module.exports = corsOptions;