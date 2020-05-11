//crypto模块的目的是为了提供通用的加密和哈希算法。
//用纯JavaScript代码实现这些功能不是不可能，但速度会非常慢。
//Nodejs用C/C++实现这些算法后，通过cypto这个模块暴露为JavaScript接口，这样用起来方便，运行速度也快
const crypto = require('crypto');

//秘钥
const SECRET_KEY = "";
// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex');
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

console.log(genPassword(123));


