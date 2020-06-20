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
    protected __runningSockets: { [key: string]: Socket } = {};

    init() {
        this.__runningSockets = {};
    }

    _t = null;
    delaytime: number = 1000;
    _start: boolean = false;
    start() {
        this._start = true;
        let self = this;
        if (this._t) {
            clearInterval(this._t);
            this._t = null;
        }
        this._t = setInterval(function () {
            self._loop()
        }, this.delaytime);
    }

    _loop() {
        this._t += this.delaytime;
        if (this._t < 3000) return;
        this._t = 0;
        this.isDisconnect();
    }

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

            if (s.getIsConnected() && s.getIsClose()) {
                s.close();
                console.log("重连重连");
                s.connect();
            }

        }
    }
}