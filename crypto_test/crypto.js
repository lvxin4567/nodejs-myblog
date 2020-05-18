//crypto模块的目的是为了提供通用的加密和哈希算法。
//用纯JavaScript代码实现这些功能不是不可能，但速度会非常慢。
//Nodejs用C/C++实现这些算法后，通过cypto这个模块暴露为JavaScript接口，这样用起来方便，运行速度也快

//-----------------md5-------------------
// const crypto = require('crypto');

// //秘钥
// const SECRET_KEY = "1112232";
// // md5 加密
// function md5(content) {
//     let md5 = crypto.createHash('md5')
//     return md5.update(content).digest('hex');
// }

// // 加密函数
// function genPassword(password) {
//     const str = `password=${password}&key=${SECRET_KEY}`
//     return md5(str)
// }

// console.log(genPassword(123));
//---------------------------------------------
// const CryptoJS = require('crypto-js');
// function getAesString(data,key,iv){//加密
//     var key  = CryptoJS.enc.Utf8.parse(key);
//     var iv   = CryptoJS.enc.Utf8.parse(iv);
//     var encrypted =CryptoJS.AES.encrypt(data,key,
//         {
//             iv:iv,
//             mode:CryptoJS.mode.CBC,
//             padding:CryptoJS.pad.Pkcs7
//         });
//     return encrypted.toString();    //返回的是base64格式的密文
// }
// function getDAesString(encrypted,key,iv){//解密
//     var key  = CryptoJS.enc.Utf8.parse(key);
//     var iv   = CryptoJS.enc.Utf8.parse(iv);
//     var decrypted =CryptoJS.AES.decrypt(encrypted,key,
//         {
//             iv:iv,
//             mode:CryptoJS.mode.CBC,
//             padding:CryptoJS.pad.Pkcs7
//         });
//     return decrypted.toString(CryptoJS.enc.Utf8);     
// }
// function getAES(data){ //加密
//     var key  = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';  //密钥
//     var iv   = '1234567812345678';
//     var encrypted =getAesString(data,key,iv); //密文
//     var encrypted1 =CryptoJS.enc.Utf8.parse(encrypted);
//     return encrypted;
// }

// function getDAes(data){//解密
//     var key  = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';  //密钥
//     var iv   = '1234567812345678';
//     var decryptedStr =getDAesString(data,key,iv);
//     return decryptedStr;
// }
// let aesData = getAES({'name':'xiaohong','age':17});

// console.log(aesData);

var CryptoJS = require("crypto-js");

var data = [{ id: 1 }, { id: 2 }]

// Encrypt
//AES  Advanced Encryption Standard
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123');
console.log(ciphertext.toString());
// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData);
