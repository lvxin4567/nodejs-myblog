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

const loginCheck = (req)=>{
    if(!req.session.username){
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}


const handBlogRouter = (req, res) => {
    if (req.method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        let loginResult = loginCheck(req);
        if(loginResult){
            return loginResult;
        }
        author = req.session.username;
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }
    if (req.method === 'GET' && req.path === '/api/blog/detail') {
        console.log('当前查阅id...', req.query.id);
        const result = getDetail(req.query.id);
        return result.then(detailData => {
            return new SuccessModel(detailData);
        })
    }
    if (req.method === 'POST' && req.path === '/api/blog/new') {
        let loginResult = loginCheck(req);
        if(loginResult){
            return loginResult;
        }
        const result = newBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }
    if (req.method === 'POST' && req.path === '/api/blog/update') {
        let loginResult = loginCheck(req);
        if(loginResult){
            return loginResult;
        }
        const result = updateBlog(req.query.id , req.body);
        return result.then(val => {
            console.log('val' , val);
            if(val){
                return new SuccessModel();
            }else{
                return new ErrorModel('更新博客失败');
            }
        })
    }
    if (req.method === 'POST' && req.path === '/api/blog/del') {
        let loginResult = loginCheck(req);
        if(loginResult){
            return loginResult;
        }
        const result = delBlog(req.query.id , author);
        return result.then(val=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('删除博客失败');
            }
        })
    }
}

module.exports = handBlogRouter