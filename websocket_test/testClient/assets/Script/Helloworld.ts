import { Socket, SOCKET_CONF } from "./socket";
import { Event } from "./Event";
import { eventQueue } from "./EventQueue";

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
    eventQueue: eventQueue = null;

    protected _wait: boolean = false;

    start() {
        // init logic
        this.label.string = this.text;
        this.eventQueue = eventQueue.getInstance();
        this.eventQueue.start();
        this.ws = new Socket(`ws://${SOCKET_CONF.host}:${SOCKET_CONF.port}`);

        Event.getInstance().on("test", (data) => {
            if (this._wait) {
                return false;
            }
            this.label.string = JSON.stringify(data);
            return true;
        }, this);
    }

    sendMsg() {
        let msg = this.editBox.string;
        this.ws.send({ msghead: "test", msgdata: msg });
    }
}
