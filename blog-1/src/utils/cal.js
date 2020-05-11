const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fullPath =  path.join(__dirname, '../', '../', 'logs' , 'access.log');
console.log(fullPath);
//创建readStream对象
const readStream = fs.createReadStream(fullPath);

// 创建 readline 对象
const rl = readline.createInterface({
    input: readStream
})

let sum = 0;
let chromeNum = 0;
rl.on('line', lineData => {
    if(!lineData){
        return;
    }
    sum++;

    if(lineData.indexOf('Chrome') > -1){
        chromeNum++;
    }
})
rl.on('close' , ()=>{
    console.log('使用谷歌用户占比:' , chromeNum * 100 / sum);
})