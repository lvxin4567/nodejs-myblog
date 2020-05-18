var express = require('express');
var router = express.Router();

//获取博客列表       api/blog/list    GET         author  keyword    
//获取一篇博客内容    api/blog/detail  GET         id
//新增一篇博客       api/blog/new     POST                           新增内容
//更新一篇博客       api/blog/update  POST        id                 更新内容
//删除一篇博客       api/blog/del     POST        id                 用户名和密码
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel');

router.get('/list', function(req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''
  // if (req.query.isadmin) {
  //     // 管理员界面
  //     const loginCheckResult = loginCheck(req)
  //     if (loginCheckResult) {
  //         // 未登录
  //         return loginCheckResult
  //     }
  //     // 强制查询自己的博客
  //     author = req.session.username
  // }
  const result = getList(author, keyword)
  return result.then(listData => {
      res.json(
        new SuccessModel(listData)
      ) 
  })
});

router.get('/detail', function(req, res, next) {
  const result = getDetail(req.query.id);
  return result.then(detailData => {
      res.json(
        new SuccessModel(detailData)
      ) 
  })
});

router.post('/new', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/update', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/del', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
