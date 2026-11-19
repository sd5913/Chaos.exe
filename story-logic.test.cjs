const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app.js','utf8');const ctx={console};vm.createContext(ctx);vm.runInContext(fs.readFileSync('story.js','utf8')+';this.days=storyDays',ctx);
function trial(day,filename,released,readAll=true){
 const file=ctx.days[day].files.find(f=>f[0]===filename),k=day+':'+filename;
 const c={day,released,finished:false,states:{[k]:'ready'},storyDays:ctx.days,viewed:new Set(readAll?ctx.days[day].files.map(f=>day+':'+f[0]):[]),gameLanguage:'en',endings:[],key:f=>day+':'+f[0],archiveImages:()=>null,render(){},talk(){},suggestNextFile(){},toast(){},showCompletion(){},showEnding(keep){thisNeverUsed=keep},};
 c.showEnding=keep=>c.endings.push(keep);vm.createContext(c);vm.runInContext(source.slice(source.indexOf('function feed(file){'),source.indexOf("target.addEventListener('dragover'")),c);c.feed(file);return c;
}
assert.deepEqual(trial(0,'job_application_v3.docx',0).endings,[]);
assert.equal(trial(0,'job_application_v3.docx',0).states['0:job_application_v3.docx'],'eaten');
assert.deepEqual(trial(6,'welcome_message.txt',0).endings,[]);
assert.equal(trial(6,'USER_PREFERENCES.cfg',0).states['6:USER_PREFERENCES.cfg'],'ready');
assert.equal(trial(6,'USER_PREFERENCES.cfg',4,false).states['6:USER_PREFERENCES.cfg'],'ready');
assert.deepEqual(trial(6,'USER_PREFERENCES.cfg',4).endings,[false]);
for(const d of ctx.days)assert.ok(d.files.reduce((s,f)=>s+f[1],0)>=d.goal);
assert.ok(ctx.days[5].files.filter(f=>f[0]!=='export_log.txt').reduce((s,f)=>s+f[1],0)>=ctx.days[5].goal);
assert.ok(ctx.days[6].files.filter(f=>f[0]!=='USER_PREFERENCES.cfg').reduce((s,f)=>s+f[1],0)>=ctx.days[6].goal);
console.log('PASS: ordinary deletion never erases memory; final file requires review/space; final deletion triggers ending once; every day and preservation path reachable.');
