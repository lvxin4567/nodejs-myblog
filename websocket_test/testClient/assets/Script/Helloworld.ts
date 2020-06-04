import { Socket, SOCKET_CONF } from "./socket";
import { EventManager } from "./EventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Button)
    btn_send: cc.Button = null;

    ws: Socket = null;

    protected _wait: boolean = false;

    start() {
        // init logic
        this.label.string = this.text;

        this.ws = new Socket('lobby');
        this.ws.doConnect({ ip: SOCKET_CONF.host, port: SOCKET_CONF.port });

        EventManager.getInstance().on("test", (data) => {
            if (this._wait) {
                return false;
            }
            this.label.string = JSON.stringify(data);
            return true;
        }, this);
    }

}
