import { eventQueue } from "./EventQueue";

export interface EventListenerInfo {
    caller: any,
    listener: Function,
    args?: any[],
}

export class Event {
    eventMap: { [key: string]: EventListenerInfo } = null;

    static __INS__: Event = null;
    static getInstance() {
        if (Event.__INS__ == null) {
            Event.__INS__ = new Event();
        }
        return Event.__INS__;
    }

    constructor() {
        this.eventMap = {};
    }


    public on = this.event_addListener;
    event_addListener(eventName: string, listener: (...args: any[]) => void, caller: any) {
        if (this.eventMap[eventName]) {
            console.error(`${eventName}事件已经注册`);
            return;
        }
        this.eventMap[eventName] = { caller: caller, listener: listener };
    }


    public emit = this.event_dispatch;
    event_dispatch(eventName: string, ...args: any) {
        let info: EventListenerInfo = this.eventMap[eventName];
        // info.listener.call(info.caller, args)
        info.args = args;
        eventQueue.getInstance().eventQueue.push(info);
    }

}