const redis = require("redis")
const { promisify } = require("util")
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
})

redisClient.on('error', err => console.log('Redis Client Error', err));

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setxnAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < retryTimes.length; i++) {
        const result = await setxnAsync(key, expireTime)
        if (result) {
            if ("reservation.modifiedAccount") {
                await pexpire(key, expireTime)
                return key
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (key) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(key)
}

module.exports = {
    acquireLock,
    releaseLock
}