import { EventEmitter } from "node:events";
class TaskQueue extends EventEmitter {
    #concurrency;
    #running=0;
    #queue=[];
    #pendingRetries = 0;
    constructor(concurrency) {
        super();
        this.#concurrency = concurrency;
    }   
    add(id, jobFn) {
        this.#queue.push({id, jobFn, attempts:0});
        this.#runNext();
    }
    #runNext() {
        while(this.#running < this.#concurrency && this.#queue.length) { 
            const task = this.#queue.shift();
            this.#running++;
            this.#runTask(task);
        }
    }
    async #runTask(task) {
        this.emit("job:start", { id: task.id });
        try {
            const result = await task.jobFn();
            this.emit("job:complete", {
                id: task.id,
                result
            });
        } catch(error) {
            if(task.attempts < 2) {
                task.attempts++;
                this.emit("job:retry", {
                    id: task.id,
                    attempt: task.attempts
                });
                this.#pendingRetries++;
                setTimeout(() => {
                    this.#pendingRetries--;
                    this.#queue.push(task);
                    this.#runNext();
                }, 100);
            } else { 
                this.emit("job:error", {
                    id: task.id,
                    error
                });
            }
        }
        this.#running--;
        this.#runNext();

        if(!this.#running && !this.#queue.length && !this.#pendingRetries) {
            this.emit("queue:empty");
        }
    }
}
export { TaskQueue };