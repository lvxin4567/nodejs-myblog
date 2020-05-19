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

const loginCheck = require('../middleware/loginCheck');



router.get('/list', loginCheck, function (req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''
  if (req.query.isadmin) {
    console.log('is admin')
    // 强制查询自己的博客
    author = req.session.username
  }
  const result = getList(author, keyword)
  return result.then(listData => {
    res.json(
      new SuccessModel(listData)
    )
  })
});

router.get('/detail', function (req, res, next) {
  const result = getDetail(req.query.id);
  return result.then(detailData => {
    res.json(
      new SuccessModel(detailData)
    )
  })
});

router.post('/new', loginCheck, function (req, res, next) {
  req.body.author = req.session.username
  const result = newBlog(req.body);
  return result.then(data => {
    // return new SuccessModel(data);
    res.json(
      new SuccessModel(data)
    )
  })
});

router.post('/update', loginCheck, function (req, res, next) {
  // res.send('respond with a resource');
  const result = updateBlog(req.query.id, req.body);
  return result.then(val => {
    console.log('val', val);
    if (val) {
      // return new SuccessModel();
      res.json(
        new SuccessModel()
      )
    } else {
      // return new ErrorModel('更新博客失败');
      res.json(
        new ErrorModel('更新博客失败')
      )
    }
  })
});

router.post('/del', loginCheck, function (req, res, next) {
  // res.send('respond with a resource');
  const author = req.session.username;
  const result = delBlog(req.query.id, author);
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('删除博客失败'))
    }
  })
});


module.exports = router;