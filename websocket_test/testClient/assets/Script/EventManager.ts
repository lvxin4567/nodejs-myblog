export interface EventListenerInfo {
    caller: any,
    listener: Function,
    args?: any[],
}

export class EventManager {
    eventManager: { [key: string]: EventListenerInfo } = null;

    static __INS__: EventManager = null;
    static getInstance() {
        if (EventManager.__INS__ == null) {
            EventManager.__INS__ = new EventManager();
        }
        return EventManager.__INS__;
    }

    constructor() {
        this.eventManager = {};
    }

    public on = this.event_addListener;
    event_addListener(eventName: string, listener: (...args: any[]) => void, caller: any) {
        // if (this.eventManager[eventName]) {
        //     console.error(`${eventName}事件已经注册`);
        //     return;
        // }
        this.eventManager[eventName] = { caller: caller, listener: listener };
    }


    public emit = this.event_dispatch;
    event_dispatch(eventName: string, args: any) {
        let info: EventListenerInfo = this.eventManager[eventName];
        info.listener.call(info.caller, args)
        // eventQueue.getInstance().eventQueue.push(info);
    }

}