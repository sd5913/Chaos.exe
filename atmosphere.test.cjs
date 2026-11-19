const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const classes=new Set();const body={dataset:{},classList:{toggle(name,on){on?classes.add(name):classes.delete(name)}}};
const context={document:{body,addEventListener(){}},window:{},console,setInterval,clearInterval,setTimeout,Audio:class{constructor(){this.paused=true}play(){this.paused=false;return Promise.resolve()}pause(){this.paused=true}}};
vm.createContext(context);vm.runInContext(fs.readFileSync('audio.js','utf8'),context);
for(let day=1;day<=7;day++){
 context.window.playBGMForDay(day);
 assert.equal(body.dataset.storyDay,String(day));
 assert.equal(classes.has('signal-fault'),day>=3);
 assert.equal(classes.has('early-dark'),day===4);
 assert.equal(classes.has('horror-mode'),day>=5);
}
context.window.playBGMForDay(1);assert.equal(classes.size,0);
console.log('PASS: visual progression Days 1–7, muted/locked audio independence, reset to Day 1');
