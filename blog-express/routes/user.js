var express = require('express');
var router = express.Router();

//登陆  api/user/login   POST  

router.post('/login', function (req, res, next) {
    const { username, password } = req.body;
    console.log(username , password , req.headers['content-type']);
    // res.send('respond with a resource');
    res.json(
        {
            errno:0 , 
            data:{
                username , 
                password
            }
        }
    )
});

module.exports = router;
