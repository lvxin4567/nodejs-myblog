import { Socket } from "./socket";

interface __INetEvent__ {
    name: string,
    type: number,
    ext: any
}
interface __IReconect__ {
    delaytime: number,
    count: number
}

const { ccclass, property } = cc._decorator;
@ccclass
export class NetManager {

    static __INS__: NetManager = null;
    static getInstance() {
        if (NetManager.__INS__ == null) {
            NetManager.__INS__ = new NetManager();
            NetManager.__INS__.init();
        }
        return NetManager.__INS__;
    }
    private _eventPool: __INetEvent__[] = [];
    protected __runningSockets: { [key: string]: Socket } = {};
    private _needReConnectSockets: { [key: string]: __IReconect__ } = null;

    init() {
        this._eventPool = [];
        this.__runningSockets = {};
    }

    _t = null;
    delaytime: number = 1000;
    _start: boolean = false;
    start() {
        this._start = true;
        let self = this;
        this._t = setInterval(function () {
            self._loop()
        }, this.delaytime);
    }

    _loop() {
        this._t += this.delaytime;
        if(this._t < 3000) return;
        this._t = 0;
        this.isDisconnect();
    }

    // checkReConnect() {
    //     for (var x in this._needReConnectSockets) {
    //         let t = Date.now() / 1000;
    //         if (t - this._needReConnectSockets[x].delaytime > 1) {
    //             this._needReConnectSockets[x].delaytime = t;
    //             this.doReConnect(x);
    //             // if (x != "lobby") {
    //             //     kaayou.emit(x, `ws::Msg::ping`, {wsname:x,ms:460});  
    //             // }
    //         }
    //     }
    // }

    getSocket(name: string): Socket {
        if (!this.__runningSockets[name]) {
            this.__runningSockets[name] = new Socket(name);
        }
        return this.__runningSockets[name];
    }
    setRunningSocket(name: string, ws: Socket) {
        this.__runningSockets[name] = ws;
    }

    isDisconnect() {
        for (var x in this.__runningSockets) {
            let s = this.__runningSockets[x];
            if (!s) break;

            if (s.getIsConnected() && !s.getInitiative()) {
                if (Date.now() / 1000 - s.getLastTime() > 15) {
                    s.close({ Initiative: false });
                    console.log("重连重连");
                }
            }
        }
    }

    onWsConnectEvent(event) {
        let data: { name: string } = event.data;
        if (!data) { return; }
        this._eventPool.push({ name: data.name, type: 1, ext: null });
    }
    onWsCloseEvent(event) {
        let data: { name: string, code: number } = event.data;
        if (!data) { return; }
        if (data.name && data.code) {
            this._eventPool.push({ name: data.name, type: 2, ext: data.code });
        }
    }

    doPool() {
        // if (this._eventPool.length > 0) {
        //     let n = this._eventPool.length;
        //     while (n > 0) {
        //         let e = this._eventPool.shift();
        //         n = this._eventPool.length;
        //         if (!e) { continue; }
        //         if (1 == e.type) {
        //             this._needReConnectSockets[e.name] = null;
        //             delete this._needReConnectSockets[e.name];
        //         } else if (2 == e.type) {
        //             if (e.ext != 1000) {
        //                 console.error(e.name + "意外断开");
        //                 if (!this._needReConnectSockets[e.name]) {
        //                     this._needReConnectSockets[e.name] = {
        //                         delaytime: Date.unix(),
        //                         count: 0
        //                     }
        //                 }

        //             }
        //         }
        //     }
        // }
    }
}