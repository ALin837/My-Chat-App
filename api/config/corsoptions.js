const allowedOrigins = require("./allowed")
const corsOptions  = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
}
module.exports = corsOptions;