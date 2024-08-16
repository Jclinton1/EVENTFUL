require("dotenv").config()

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
}

export const redisConfig = {
    host: process.env.REDIS_HOST || 'Eventful',
    port: parseInt(process.env.REDIS_PORT || '6379'), // default Redis port
    password: process.env.REDIS_PASSWORD || 'jessyhuncho12',
};
