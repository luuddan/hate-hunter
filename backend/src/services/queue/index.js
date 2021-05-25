export class TimedActionQueue{
    constructor() {
      this.queue = []
      this.running = false;
      this.queueTime = 0;
      this.ending = null;
    }
  
    add(action, timeOut, note){
      this.queue.push({action, timeOut, note})
      this.queueTime += timeOut;
      if(this.running === false)
        this.run()
      return this.queueTime;
    }
  
    async run(){
      if(this.queue.length === 0){
        this.running = false;
        this.ending && this.ending()
        return
      }
      this.running = true;
      console.log("---queue----",this.queue)
      setTimeout(async () => {
        this.queueTime -= this.queue[0].timeOut
        await this.queue[0].action();
        this.queue.shift();
        this.run();
    }, this.queue[0].timeOut)
  }
  }