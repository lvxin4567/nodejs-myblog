var express = require('express');
var router = express.Router();

router.get('/login', function (req, res, next) {
    const { username, password } = req.body;
    console.log(username , password);
    res.send('respond with a resource');
});

module.exports = router;
