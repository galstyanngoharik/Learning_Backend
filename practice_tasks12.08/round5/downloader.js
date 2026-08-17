import { EventEmitter } from "node:events";
class Downloader extends EventEmitter {
    constructor() {
        super();
    }
    start() {
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const percentage = step * 10;
            this.emit("progress", percentage);
            if(percentage === 100) {
                clearInterval(timer);
                this.emit("done");
            }
        }, 1000);
    }
}
export { Downloader };
