const http = require('http');
const slice = Array.prototype.slice;

class like_express {
    constructor() {
        this.router = {
            all: [],
            get: [],
            post: []
        }
    }
    register(path) {
        // console.log(arguments instanceof Array);
        // arguments是一个object对象，它不是数组，不能对它使用shift、push、join等方法。
        let info = {};
        if (typeof path === 'string') {
            info.path = path;
            info.stack = slice.call(arguments, 1);
        } else {
            info.path = '/';
            info.stack = slice.call(arguments, 0);
        }
        return info;
    }
    use() {
        let routerInfo = this.register.apply(this, arguments);
        console.log('routerInfo1', routerInfo)
        this.router.all.push(routerInfo);
    }
    get() {
        let routerInfo = this.register.apply(this, arguments);
        console.log('routerInfo2', routerInfo)
        this.router.get.push(routerInfo);
    }
    post() {
        let routerInfo = this.register.apply(this, arguments);
        this.router.post.push(routerInfo);
    }
    match(url, method) {
        let routerList = [];

        routerList = routerList.concat(this.router.all);
        routerList = routerList.concat(this.router[method]);

        let stack = [];
        for (let x in routerList) {
            if (url.indexOf(routerList[x].path) === 0) {
                stack = stack.concat(routerList[x].stack);
            }
        }
        console.log('stack', stack)
        return stack;

    }

    handle(req, res, stack) {
        const next = () => {
            const middleware = stack.shift();
            if (middleware) {
                middleware(req, res, next);
            }
        }
        next(req, res, stack);
    }
    listen(...args) {
        const server = http.createServer((req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url;
            const method = req.method.toLowerCase();
            let stack = this.match(url, method);
            this.handle(req, res, stack);
        })
        server.listen(...args);
    }


}

module.exports = () => {
    return new like_express();
}