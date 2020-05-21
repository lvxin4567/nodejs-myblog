const http = require('http');
// const slice = Array.prototype.slice;

export class like_express {
    constructor() {
        this.router = {
            all: [],
            get: [],
            post: []
        }
    }
    register(path) {
        let info = {};
        if (typeof path === 'string') {
            info.path = path;
            info.stack = arguments.slice(1);
        } else {
            info.path = '/';
            info.stack = arguments.slice();
        }
        return info;
    }
    use() {
        let routerInfo = this.register(arguments);
        this.router.all.push(routerInfo);
    }
    get() {
        let routerInfo = this.register(arguments);
        this.router.get.push(routerInfo);
    }
    post() {
        let routerInfo = this.register(arguments);
        this.router.post.push(routerInfo);
    }
    match(url, method) {
        let routerList = [];

        routerList = routerList.concat(this.router.all);
        routerList = routerList.concat(this.router[method]);

        for(let x in routerList){
            
        }

        for (let x in this.router[method]) {
            if (url.indexOf(this.router[method][x].path) === 0) {
                routerList = routerList.concat(this.router[method][x]);
            }
        }

        console.log('routerList', routerList);
        return routerList;

    }

    handle(routerList) {
        const next = (req, res) => {
            let info = routerList.shift();
            res.end(
                
            )
        }
        next(routerList)
    }
    listen() {
        const server = http.createServer((req, res) => {
            let routerList = this.match(req.url, req.method);
            this.handle(routerList);
        })
        server.listen(8000);
    }


}

const app = new like_express();


module.exports = () => {
    new like_express();
}