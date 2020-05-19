const {ErrorModel} = require('../model/resModel')

//检测登陆中间件
module.exports = (req , res , next)=>{
    if(!req.session.username){
        res.json(
            new ErrorModel('未登陆')
        )
        return;
    }
    next();
}