import { Socket, SOCKET_CONF_HALL } from "./socket";
import { EventManager } from "./EventManager";
import { eventQueue } from "./EventQueue";
import JumpManager from "./JumpManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class hallScene extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Button)
    btn_send: cc.Button = null;

    @property(cc.RichText)
    test_rich:cc.RichText = null;

    ws: Socket = null;

    protected _wait: boolean = false;

    jumpManager: JumpManager = null;

    onLoad() {
        // init logic
        let self = this;
        this.label.string = this.text;

        this.jumpManager = cc.find('persistRootNode').getComponent('JumpManager');

        this.ws = new Socket('lobby');
        this.ws.doConnect({ ip: SOCKET_CONF_HALL.host, port: SOCKET_CONF_HALL.port });

        this.test_rich.string = "<color=#00ff00>Rich</c><color=#0fffff>Text</color>";

        EventManager.getInstance().on("hallScene::test", (data) => {
            this.label.string = JSON.stringify(data);
        }, this);

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

        EventManager.getInstance().on("ws::msg::lobbyToGame", (data) => {
            eventQueue.getInstance().eventQueue.push({
                caller: this, listener: (recdata) => {
                    if (this._wait) {
                        return false;
                    }
                    console.log(`收到服务器消息${JSON.stringify(recdata)}`);
                    // cc.director.loadScene("gameScene", (recdata) => {
                    //     console.log("recdata", recdata);
                    // })
                    this.jumpManager.setJumpData(recdata);
                    cc.director.loadScene("gameScene");
                    return true;
                }, args: data
            })
        }, this);
    }


    sendEvent(e) {
        // this.ws.send({ msghead: "test", msgdata: this.label.string });

        this.ws.send({ msghead: "lobbyToGame" });

        // cc.director.loadScene("gameScene" , (data)=>{
        //     console.log(data)
        // });
    }

    onDestroy() {
        this.ws.close({ Initiative: true });
    }

}
