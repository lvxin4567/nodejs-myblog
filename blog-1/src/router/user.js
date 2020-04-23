const {
    login
} = require("../controller/user")
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel');

const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    console.log('d.toGMTString is', d.toGMTString());
    return d.toGMTString();
}

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST
    // 登录
    if (method === 'GET' && req.path === '/api/user/login') {
        let {
            username,
            password
        } = req.query;
        // const result = login(req.body.username , req.body.password);
        let result = login(username, password);
        return result.then(data => {
            if (data.username) {
                //设置session
                req.session.username = data.username;
                req.session.realname = data.realname;
                console.log('req.session is ' , req.session);
                return new SuccessModel();
            }
            return new ErrorModel('登陆失败');
        })
    }

    //登陆测试
    if(method === 'GET' && req.path === '/api/user/login_test'){
        if(req.session.username){
            return Promise.resolve(
                new SuccessModel({
                    session : req.session
                })
            )
        }
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }

    
}

module.exports = handleUserRouter;