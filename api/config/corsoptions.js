const allowedOrigins = require("./allowed")
const corsOptions  = {
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200
}
module.exports = corsOptions;