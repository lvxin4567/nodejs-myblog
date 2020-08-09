const { MYSQL_CONF } = require('../conf/db')
const mysql = require('mysql')

//创建一个数据库链接对象
console.log("MYSQL链接配置为...", JSON.stringify(MYSQL_CONF))
const con = mysql.createConnection(MYSQL_CONF);
con.connect();

function exec(sql) {
    console.log('执行sql:', sql);
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return null;
            }
            resolve(result);
        })
    })
    return promise;
}

module.exports = {
    exec,
    escape: mysql.escape
}