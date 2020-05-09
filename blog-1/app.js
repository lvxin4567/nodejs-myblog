//描述              接口             方法         url参数             备注
//获取博客列表       api/blog/list    GET         author  keyword    
//获取一篇博客内容    api/blog/detail  GET         id
//新增一篇博客       api/blog/new     POST                           新增内容
//更新一篇博客       api/blog/update  POST        id                 更新内容
//删除一篇博客       api/blog/del     POST        id                 用户名和密码
//登陆              api/user/login   POST     


/**
 * 1.注意const和let区别
 * 2.在postman中发送json对象的时候 注意字符串是双引号
 */

//-------什么是cookie-------
//定义 cookie  保存在浏览器中的字符串 最大5KB(k1=v1,k2=v2)
//特点1 不同域名浏览器中保存的cookie不一样,跨域不共享
//特点2 每次发送http请求 会将请求域的cookie发送给服务端
//特点3 服务端可以修改cookie并返回给浏览器
//特点4 浏览器可以通过javascript修改cookie(有限制)

//-------什么是session--------
//cookie问题 会暴露username,很危险
//如何解决 cookie中存储userid server端对应username
//思路 服务器给客户端设置userid

//------session的问题---------
// 目前session是js变量 js变量是存在于node.js内存中的
// 进程内存有限 访问量过大怎么办 内存暴增怎么办
// 第二 正式线上运行的是多进程 进程之间内存无法共享

//-----------------mysql v8.0后版本链接不上的解决方案----------------------  
// mysql -u root -p
// ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'xin123';
// FLUSH PRIVILEGES;
// 作者：car
// 链接：https://www.imooc.com/article/details/id/45589
// 来源：慕课网

const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { get, set } = require('./src/db/redis');

const querystring = require('querystring');

// let SESSION_DATA = {};

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', (chunk) => {
            postData += chunk.toString();
        })
        req.on('end', () => {
            console.log(postData);
            if (!postData) {
                resolve({})
                return;
            }
            resolve(JSON.parse(postData));
        })
    })
}

const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

const serverHandle = (req, res) => {
    //设置返回格式
    res.setHeader('Content-type', 'application/json');

    const url = req.url;
    req.path = url.split('?')[0]; //路由
    req.query = querystring.parse(url.split('?')[1]);

    //解析cookie 格式:k1=v1;k2=v2;k3=v3;
    req.cookie = {};
    let cookiestr = req.headers.cookie || '';
    cookiestr.split(";").forEach(item => {
        if (!item) {
            return;
        }
        const key = item.split("=")[0].trim();
        const val = item.split("=")[1].trim();
        req.cookie[key] = val;
    });



    // 解析 session （使用 redis）
    let needSetCookie = false;
    let userId = req.cookie['userid'];
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}`;
        set(userId, {});
    }
    req.sessionId = userId;
    console.log("登录userId = ", userId);
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {});
            // 设置 session
            req.session = {};
        } else {
            req.session = sessionData
        }
        return getPostData(req)
    }).then((postData) => {
        req.body = postData;

        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            if (needSetCookie) {
                console.log("Set-Cookie"  , userId);
                res.setHeader('Set-Cookie', `userid=${userId};httpOnly;expires=${getCookieExpires()}`)
            }
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return;
        }

        const userResult = handleUserRouter(req, res);
        if (userResult) {
            if (needSetCookie) {
                console.log("Set-Cookie"  , userId);
                res.setHeader('Set-Cookie', `userid=${userId};httpOnly;expires=${getCookieExpires()}`)
            }
            userResult.then(userData => {
                res.end(JSON.stringify(userData))
            })
            return;
        }

        // 未命中路由，返回 404
        res.writeHead(404, {
            "Content-type": "application/textplain"
        });
        res.write("404 Not Found/n");
        res.end();
    })
}

module.exports = serverHandle

// use myblog;
// -- show tables;
// -- insert into users (username,`password`,realname) values ("lisi",1232,"李四");
// -- select * from users;
// -- select id,username from users;
// -- select * from users where username='lisi' and `password`=1232
// -- select * from users where username like '%zhang%'
// -- select * from users where `password` like '%1%' order by id desc
// -- update users set realname='李四2' where username='lisi';
// -- delete from users where realname='李四2'