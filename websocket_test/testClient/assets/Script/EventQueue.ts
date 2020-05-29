import { EventListenerInfo } from "./Event";

export class eventQueue{

    eventQueue: Array<EventListenerInfo> = null;
    private _isOpen: boolean = false;

    static __INS__: eventQueue = null;
    static getInstance() {
        if (eventQueue.__INS__ == null) {
            eventQueue.__INS__ = new eventQueue();
        }
        return eventQueue.__INS__;
    }

    constructor() {
        this.eventQueue = [];
    }
    release() {
        this.eventQueue = [];
    }
    
    _t = null;
    start(){
        this._isOpen = true;
        this.release();
        let self = this;
        this._t = setInterval(function () {
            self._loop()
        }, 0);
    }
    
    _loop(){
        if(!this._isOpen){
            return;
        }
        if(this.eventQueue.length > 0){
            let info = this.eventQueue[0];
            if(true === info.listener.call(info.caller , info.args)){
                this.eventQueue.shift();
            }
        }
    }



    




}