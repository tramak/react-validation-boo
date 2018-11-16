export default class Observer {
    constructor() {
        this.lists = {};
    }
    subscribe(event, fn) {
        if(!this.lists[event]) this.lists[event] = [];
        this.lists[event].push(fn);
    }
    unsubscribe(event, fn) {
        if(!this.lists[event]) return;
        this.lists[event] = this.lists[event].filter(item => item !== fn);
    }
    publish(event, data) {
        if(!this.lists[event]) return;
        this.lists[event].forEach(item => item(data));
    }
}