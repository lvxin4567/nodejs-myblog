const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')


//创建
console.log("REDIS链接配置为...", JSON.stringify(REDIS_CONF))
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val);
    }
    redisClient.set(key, val, redis.print);
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
                return;
            }
            if (val == null) {
                reject(val);
                return;
            }
            try {
                resolve(
                    JSON.parse(val)
                );
            } catch (error) {
                resolve(val);
            }
        })
    })
    return promise;
}



module.exports = {
    get,
    set
}