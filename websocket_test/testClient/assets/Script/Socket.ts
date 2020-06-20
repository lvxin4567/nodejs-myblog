import { EventManager } from "./EventManager";
import { eventQueue } from "./EventQueue";
import { NetManager } from "./NetManager"

export const SOCKET_CONF_HALL = {
    host: '127.0.0.1',
    port: '8001'
};
export interface socketData {
    msghead: string,
    msgdata?: any,
    msgtime?: number
}

export class Socket {
    private ws: WebSocket = null;
    __lastMsgTime = 0;
    eventQueue: eventQueue = null;
    HeartCheck: cc.Component = null;
    name: string = "";
    private _isNeedConnect: boolean = false; //是否应该为连接状态
    private _isInitiative: boolean = false;//是否主动断开
    private _isClose: boolean = true;//是否为关闭状态

    private linkUrl: string = "";

    constructor(name: string) {
        this.name = name;
    }

    doConnect(data: { ip: string, port: string }) {
        this.linkUrl = `ws://${data.ip}:${data.port}`;
        this.connect();
    }

    connect() {
        this._isNeedConnect = true;

        try {
            console.log(`${this.name}socket开始链接${this.linkUrl}`)
            this.ws = new WebSocket(this.linkUrl);
            this.ws.binaryType = 'arraybuffer';
            this.ws.onopen = this.__onOpen.bind(this);
            this.ws.onmessage = this.__onmessage.bind(this);
            this.ws.onclose = this.__onclose.bind(this);
            this.ws.onerror = this.__onError.bind(this)
        } catch (error) {
            console.error(error);
        }
    }

    private __onOpen() {
        console.log(`${this.linkUrl}链接成功`);
        this._isClose = false;

        NetManager.getInstance().setRunningSocket(this.name, this);
        NetManager.getInstance().start();

        this.eventQueue = eventQueue.getInstance();
        this.eventQueue.start();

        this.__lastMsgTime = Date.now();
        this.__doPing();
    }

    private __onmessage(e) {
        console.log('onmessage', e);
        let data = JSON.parse(e.data);
        EventManager.getInstance().emit(`ws::msg::${data.msghead}`, !data.msgdata ? {} : JSON.parse(data.msgdata));
        this.__lastMsgTime = Date.now() / 1000;
    }

    public getLastTime() {
        return this.__lastMsgTime;
    }
    public getIsConnected() {
        return this._isNeedConnect;
    }
    public getInitiative(): boolean {
        return this._isInitiative;
    }
    public getIsClose() {
        return this._isClose;
    }

    close(data?: { Initiative: boolean }) {
        cc.log(this.name + "close");
        this.__clearT();
        if (!this.ws) { return; }
        // if (data) {
        //     this._isInitiative = !!data.Initiative;
        // } else {
        //     this._isInitiative = false;
        // }
        // if (this._isInitiative) {
        //     this._isNeedConnect = false;
        // }
        if (data) {
            this._isNeedConnect = !data.Initiative;
        } else {
            this._isNeedConnect = true;
        }
        this._isClose = true;
        if (this.ws.readyState == WebSocket.OPEN) {
            this.ws.onopen = function () { };
            this.ws.onmessage = function () { };
            this.ws.onclose = function () { };
            this.ws.onerror = function () { };
            this.ws.close();
            this.ws = null;
        }
    }


    private __onclose(e) {
        cc.log(this.name + "__onclose");
        this.__clearT();
        //e.code
        // 1000          正常关闭       当你的会话成功完成时发送这个代码
        // 1001          离开           因应用程序离开且不期望后续的连接尝试而关闭连接时，发送这一代码。服务器可能关闭，或者客户端应用程序可能关闭
        // 1002          协议错误       当因协议错误而关闭连接时发送这一代码
        // 1003     不可接受的数据类型  当应用程序接收到一条无法处理的意外类型消息时发送这一代码
        // 1004          保留           不要发送这一代码。根据 RFC 6455，这个状态码保留，可能在未来定义
        // 1005          保留           不要发送这一代码。WebSocket API 用这个代码表示没有接收到任何代码
        // 1006          保留           不要发送这一代码。WebSocket API 用这个代码表示连接异常关闭
        // 1007          无效数据       在接收一个格式与消息类型不匹配的消息之后发送这一代码。如果文本消息包含错误格式的 UTF-8 数据，连接应该用这个代码关闭
        // 1008          消息违反政策    当应用程序由于其他代码所不包含的原因终止连接，或者不希望泄露消息无法处理的原因时，发送这一代码
        // 1009          消息过大        当接收的消息太大，应用程序无法处理时发送这一代码（记住，帧的载荷长度最多为64 字节。即使你有一个大服务器，有些消息
        // 也仍然太大。）
        // 1010          需要扩展        当应用程序需要一个或者多个服务器无法协商的特殊扩展时，从客户端（浏览器）发送这一代码
        // 1011          意外情况       当应用程序由于不可预见的原因，无法继续处理连接时，发送这一代码
        // 1015      TLS失败（保留） 不要发送这个代码。WebSocket API 用这个代码表示 TLS 在 WebSocket 握手之前失败。
        // 0 ～ 999        禁止              1000 以下的代码是无效的，不能用于任何目的
        // 1000 ～ 2999    保留              这些代码保留以用于扩展和 WebSocket 协议的修订版本。按照标准规定使用这些代码，参见表 3-4
        // 3000 ～ 3999   需要注册          这些代码用于“程序库、框架和应用程序”。这些代码应该在 IANA（互联网编号分配机构）公开注册
        // 4000 ～ 4999   私有             在应用程序中将这些代码用于自定义用途。因为它们没有注册，所以不要期望它们能被其他 WebSocket广泛理解

        console.log("socket已断开：", JSON.stringify(e));
        // kaayou.emit( "ws::onClose");
        if (e.code == 1000) {
            this._isNeedConnect = false;
        } else {
            this._isNeedConnect = true;
        }
        this._isClose = true;
        this.ws = null;
    }

    private __onError(err, a) {
        console.log(err);
    }

    send(data: socketData) {
        if(!this.ws){
            return;
        }
        if (this.ws.readyState != WebSocket.OPEN) {
            return;
        }
        if (data.msgdata) {
            console.log("socket发送的数据", data.msgdata);
        }
        if (!data.msgtime) {
            data.msgtime = Date.now();
        }
        if (data.msgdata) {
            data.msgdata = JSON.stringify(data.msgdata);
        }
        this.ws.send(JSON.stringify(data));
    }

    private __t = null;
    private __doPing() {
        let self = this;
        this.send({ msghead: `${this.name}_ping` });
        let pingTime = 3000;
        this.__t = setTimeout(function () {
            self.__doPing.apply(self);
        }, pingTime);
    }
    private __clearT() {
        if (this.__t) {
            try {
                clearTimeout(this.__t);
                this.__t = null;
            } catch (e) { }
        }
        this.__t = null;
    }
}