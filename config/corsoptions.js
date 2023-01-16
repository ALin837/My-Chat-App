const allowedOrigins = require("./allowed")
const corsOptions  = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

    }, 
    optionsSuccessStatus: 200
}
module.exports = corsOptions;