import { Event } from "./Event";

export const SOCKET_CONF = {
    host: '127.0.0.1',
    port: '8001'
}


export class Socket {
    private ws: WebSocket = null;
    __lastMsgTime = 0;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = this.__onOpen.bind(this);
        this.ws.onmessage = this.__onmessage.bind(this);
        this.ws.onclose = this.__onclose.bind(this);
        this.ws.onerror = this.__onError.bind(this)
    }

    private __onOpen() {
        console.log("socket 链接成功");
        this.__lastMsgTime = Date.now();
        this.__doPing();
    }

    private __onmessage(e) {
        // console.log('onmessage', e);
        this.__lastMsgTime = Date.now();
        let data = JSON.parse(e.data);
        Event.getInstance().emit(data.msghead, !data.msgdata ? {} : JSON.parse(data.msgdata));
    }

    private __onclose(e) {
        cc.log(e);
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
        this.ws = null;
    }

    private __onError(err, a) {

    }

    send(data: { msghead: string, msgdata?: any }) {
        if (data.msgdata) {
            console.log("socket发送的数据", data.msgdata);
        }
        let toData: { head: string, data?: string } = {
            head: data.msghead
        }
        if (data.msgdata) {
            toData.data = JSON.stringify(data.msgdata);
        }
        this.ws.send(JSON.stringify(toData));
    }

    private __t = null;
    private __doPing() {
        let self = this;
        this.send({ msghead: "ping" });
        let pingTime = 5000;
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