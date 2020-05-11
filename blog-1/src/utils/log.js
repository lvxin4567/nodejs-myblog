const fs = require('fs');
const path = require('path');

//写访问日志
function writeLog(log) {
    writeStream.write(log + '\n');
}

//生成写入流
const writeStream = createWriteStream('access.log');
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, { flags: 'a' });
    return writeStream;
}

module.exports = {
    writeLog
}

