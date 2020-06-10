import { Socket, SOCKET_CONF_HALL } from "./socket";
import { EventManager } from "./EventManager";
import { eventQueue } from "./EventQueue";
import JumpManager from "./JumpManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameScene extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // @property(cc.EditBox)
    // editBox: cc.EditBox = null;

    // @property(cc.Button)
    // btn_send: cc.Button = null;

    ws: Socket = null;

    protected _wait: boolean = false;

    jumpManager: JumpManager = null;

    onLoad() {
        // init logic
        this.label.string = this.text;
        this.jumpManager = cc.find('persistRootNode').getComponent(JumpManager);
        let connectData = this.jumpManager.getJumpData();
        console.log('connectData', connectData);

        this.ws = new Socket('game');
        this.ws.doConnect({ ip: connectData.host, port: connectData.port });

        EventManager.getInstance().on(`ws::msg::${this.ws.name}_ping`, (data) => {
            eventQueue.getInstance().eventQueue.push({
                caller: this, listener: (recdata) => {
                    if (this._wait) {
                        return false;
                    }
                    console.log(`收到服务器消息${JSON.stringify(recdata)}`)
                    return true;
                }, args: data
            })
        }, this);

        this.text = "游戏场景";
    }


    sendEvent(e) {
        // this.ws.send({ msghead: "test", msgdata: this.label.string });
        cc.director.loadScene("hallScene");
    }

    onDestroy(){
        this.ws.close({ Initiative: true });
    }

}
