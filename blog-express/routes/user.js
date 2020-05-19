var express = require('express');
var router = express.Router();
const {
    login
} = require("../controller/user")
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel');

//登陆  api/user/login   POST  
router.post('/login', function (req, res, next) {
    let {
        username,
        password
    } = req.body;
    const result = login(username, password);
    return result.then(data => {
        console.log('登录数据...' , data , req.session );
        if (data.username) {
            //设置session
            req.session.username = data.username;
            req.session.realname = data.realname;
            console.log('req.session' , req.session)
            // //同步到redis
            // set(req.sessionId, req.session);
            // return new SuccessModel();
            res.json(new SuccessModel())
            return ;
        }
        // return new ErrorModel('登陆失败');
        res.json(new ErrorModel('登陆失败'));
    })
});

module.exports = router;