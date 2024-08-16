import { createClient } from 'redis';
import logger from './logging/logger';
import Redis from 'ioredis';
import { redisConfig } from './config/config';

// debugging

console.log('Redis Config:', redisConfig); 


const redis = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
});

const redisClient = createClient();

redisClient.on('error', (err) => {
    logger.error('Redis Client Error', err);
    console.error('redis client error')
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis')
    console.log('connected to redis');
    redis.quit();
});

redisClient.connect();

export default redisClient;
