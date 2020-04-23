const {add,mul} = require('./a')
const loadsh = require('loadsh')

const sum = add(10,20);
const mulres = mul(10,20);

console.log(sum,mulres);

var arr = [1,2];
console.log(loadsh.concat(arr,3));




