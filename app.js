const $ = s => document.querySelector(s);
const list = $('#file-list'), folder = $('#files-window'), dialog = $('#dialog-backdrop');
const speech = $('#speech'), milo = $('#milo'), target = $('#pet-target');
const complete = $('#complete-backdrop'), nextButton = $('#restart');
let day = 0, released = 0, selected = null, finished = false, toastTimer;
let states = {}, memories = new Set(), viewed = new Set();
const finishDay = document.createElement('button');
finishDay.className = 'button primary'; finishDay.textContent = '完成当天 →'; finishDay.hidden = true;
finishDay.style.marginTop = '10px'; $('#goal-card').append(finishDay);
finishDay.onclick = () => {
  if (released < storyDays[day].goal) return;
  const unread = storyDays[day].files.filter(file => !viewed.has(key(file)));
  if (unread.length) { toast(`请先查看今天的全部文件，还剩 ${unread.length} 个未查看。`); return; }
  finished = true; showCompletion();
};
const greetings = [
  'Welcome back. Let’s see what we have today.',
  'There are still old files to sort through.',
  'Some files may contain linked records.',
  'Today’s files include messages and work records.',
  'Several transaction records are taking up space.',
  'The next cleanup target requires more space.',
  'Only a few files remain. I am following your preferences.'
];
const dayStories = [
  {title:'A FRESH START', text:'Milo：欢迎回来！我发现桌面上有一些旧文件。我们先打开 My Files，看看哪些需要清理吧。'},
  {title:'OLD RECORDS', text:'Milo：还有一些旧记录需要整理。请打开文件看看，再决定是否保留。'},
  {title:'SOMETHING IS FAMILIAR', text:'Milo：今天也有一些旧数据。你似乎在某些文件上停留得更久了，慢慢来。'},
  {title:'CLIENT REQUESTS', text:'Milo：今天的文件里有一些邮件和工作记录。需要清理的时候，请告诉我。'},
  {title:'PAYMENT HISTORY', text:'Milo：检测到一些交易记录。清理目标仍在等待完成。'},
  {title:'NO MORE JUNK', text:'Milo：要释放的空间比之前更多了。我会按照你的偏好，继续协助你。'},
  {title:'COMPLETE CLEANUP', text:'Milo：只剩下少量文件了。完成清理之前，或许应该看看你以前设置的用户偏好。'}
];
const storyOverlay=document.createElement('div');
storyOverlay.className='dialog-backdrop'; storyOverlay.hidden=true;
storyOverlay.innerHTML='<section class="window dialog-window" role="dialog" aria-modal="true" aria-labelledby="story-title"><div class="window-title"><span>✳ STORY / 剧情提示</span></div><div class="dialog-content"><div class="dialog-eyebrow" id="story-day"></div><h2 id="story-title"></h2><div class="file-preview" id="story-text" style="white-space:pre-line"></div><div class="dialog-actions"><button class="button primary" id="story-close">继续游戏 →</button></div></div></section>';
document.querySelector('.desktop').append(storyOverlay);
function showStory(){const story=dayStories[day];$('#story-day').textContent=`DAY ${String(day+1).padStart(2,'0')} / 今日剧情`;$('#story-title').textContent=story.title;$('#story-text').textContent=story.text;storyOverlay.hidden=false;$('#story-close').focus()}
$('#story-close').onclick=()=>{storyOverlay.hidden=true};
const clueText = {
  'card_NY_084.png':'ERIS: This card… isn’t mine.',
  'profile_021.jpg':'SYSTEM: Related record detected: NY-084.',
  'data_merge_script.py':'ERIS: I wrote this.',
  'address_records.csv':'SYSTEM: Multiple files share the same identifier.\nERIS: Why were these details collected together?',
  'client_requests.eml':'ERIS: This message was sent to me?',
  'payment_history.png':'SYSTEM: Payment linked to a processed record.\nERIS: I received this money?',
  'package_manifest.json':'ERIS: These were all in the same package.',
  'export_log.txt':'ERIS: Sent by… me?',
  'USER_PREFERENCES.cfg':'MILO: This is what you configured me to do.\nERIS: These records… they’re mine.'
};
const fileThoughts = {
  'travel_archive.zip':['这些行程记录……我为什么记不起来？','旧的工作资料而已。你可以先看看，再决定。'],
  'card_NY_084.png':['这张卡不属于我，为什么会在这里？','可能是误存的图片。留着也占空间。'],
  'profile_021.jpg':['照片里的人是谁？这个编号好像见过。','只是一个旧文件，不必想太多。'],
  'data_merge_script.py':['这是我写的代码？我用它整理过什么？','你以前常处理数据，这很正常。'],
  'client_requests.eml':['这些要求……我真的答应过吗？','不舒服的东西，可以交给我处理。'],
  'payment_history.png':['这些钱从哪里来？我到底做了什么？','别看太久。清理目标还没有完成。'],
  'export_log.txt':['发送人是我。那些资料真的被我送出去了？','我一直按照你的指示工作。'],
  'USER_PREFERENCES.cfg':['这些设置是我自己留下的吗？','你让我清理证据，也让我帮你忘记。']
};
const dayThoughts = [
  ['这些文件看起来很普通……但我为什么一点印象也没有？','慢慢看，整理完就会轻松一些。'],
  ['这份旧记录和我有什么关系？','如果用不到，就让我帮你清理吧。'],
  ['好像有哪里不对，我是不是漏掉了什么？','不用担心，我会照顾好这些文件。'],
  ['这份记录背后还有什么我不知道的事？','有些东西留下来只会让你分心。'],
  ['我越看越觉得不安。','请继续清理，我们快完成了。'],
  ['如果把它删掉，我还会记得吗？','你说过，有些事不需要记住。'],
  ['也许答案一直就在这些文件里。','你真的想知道吗？']
];
const fileConversation=document.createElement('div');
fileConversation.className='file-preview';
fileConversation.style.cssText='margin-top:12px;white-space:pre-line';
fileConversation.setAttribute('aria-live','polite');
$('#dialog-text').after(fileConversation);
function updateIntro(){
  const intro=$('#desktop-intro'); intro.querySelector('span').textContent=`DAY ${String(day+1).padStart(2,'0')} / ${dayStories[day].title}`;
  intro.querySelector('h2').textContent=dayStories[day].title;
  intro.querySelector('p').textContent=dayStories[day].text;
}
function talk(text, mood='idle') { speech.textContent = text; milo.className = 'milo ' + mood; }
function toast(text) { const el=$('#toast'); el.textContent=text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),3500); }
function key(file) { return day + ':' + file[0]; }
function render() {
  const current=storyDays[day]; list.innerHTML='';
  document.querySelector('.menu-day').textContent=`DAY ${String(day+1).padStart(2,'0')}`;
  document.querySelector('.desktop-label b').textContent=`DAY ${String(day+1).padStart(2,'0')} • 09:14 AM`;
  document.querySelector('.goal-card > div:first-child span').textContent=`DAY ${String(day+1).padStart(2,'0')} / CLEANUP GOAL`;
  current.files.filter(f=>states[key(f)]!=='eaten').forEach(file=>{
    const state=states[key(file)] || 'new', row=document.createElement('div');
    row.className='file-row'+(state==='ready'?' ready':''); row.tabIndex=0; row.setAttribute('role','button');
    row.draggable=state==='ready'; row.setAttribute('aria-label',`${file[0]}, ${file[1]} units`);
    row.innerHTML='<div class="file-main"><span class="file-symbol">▤</span><span class="file-name"></span></div><span class="file-type">FILE</span><span class="file-size"></span><span class="file-state"></span>';
    row.querySelector('.file-name').textContent=file[0]; row.querySelector('.file-size').textContent=file[1]+' U';
    row.querySelector('.file-state').textContent=state==='ready'?'待删除':state==='kept'?'已保留':viewed.has(key(file))?'已查看':'未查看';
    row.addEventListener('dblclick',()=>openFile(file));
    row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openFile(file)}});
    row.addEventListener('click',()=>{if(matchMedia('(max-width:760px)').matches)openFile(file);else if(state==='ready')toast('拖给 Milo，或双击后点击“喂给 Milo”。')});
    row.addEventListener('dragstart',e=>{if(state!=='ready'){e.preventDefault();toast('先双击文件，选择“准备删除”。');return}e.dataTransfer.setData('text/plain',file[0]);target.classList.add('drag-over')});
    row.addEventListener('dragend',()=>target.classList.remove('drag-over')); list.append(row);
  });
  $('#file-count').textContent=`${current.files.filter(f=>states[key(f)]!=='eaten').length} ITEMS`;
  const pct=Math.min(100,Math.round(released/current.goal*100));
  $('#goal-percentage').textContent=pct+'%'; $('#released').textContent=released;
  document.querySelector('.goal-bottom span:first-child').innerHTML=`释放 <strong id="released">${released}</strong> / ${current.goal} 单位`;
  const unreadCount=current.files.filter(file=>!viewed.has(key(file))).length;
  $('#remaining').textContent=released>=current.goal?(unreadCount?`目标已达成 · 还需查看 ${unreadCount} 个文件`:'目标已达成 · 文件已全部查看'):`还需 ${current.goal-released} 单位 · 未查看 ${unreadCount} 个`;
  $('#progress-bar').style.width=pct+'%';
  finishDay.hidden=released<current.goal;
}
function openFile(file) {
  if(finished || states[key(file)]==='eaten')return; selected=file;
  $('#dialog-title').textContent=file[0]; $('#dialog-type').textContent='FILE';
  $('#dialog-meta').textContent=`${file[1]} UNITS / FICTIONAL FILE`;
  let content=file[2];
  if(clueText[file[0]]) content+='\n\n── STORY ──\n'+clueText[file[0]];
  if(file[3]) { memories.add(key(file)); content+='\n\n✦ MEMORY FRAGMENT\n'+file[3]; }
  $('#dialog-text').textContent=content;
  const [thought,miloLine]=fileThoughts[file[0]] || dayThoughts[day];
  fileConversation.textContent=`ERIS / 心里想\n${thought}\n\nMILO\n${miloLine}`;
  viewed.add(key(file)); render();
  $('#prepare-file').textContent=states[key(file)]==='ready'?'喂给 Milo':'准备删除';
  dialog.hidden=false; talk(miloLine,'read'); $('#dialog-close').focus();
}
function closeDialog(){dialog.hidden=true;selected=null;}
$('#dialog-close').onclick=closeDialog;
dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.hidden)closeDialog()});
$('#keep-file').onclick=()=>{if(!selected)return;const f=selected;states[key(f)]='kept';closeDialog();render();talk('Understood. Keeping it.');toast('已保留 '+f[0]+'，可以随时重新查看。')};
$('#prepare-file').onclick=()=>{if(!selected)return;const f=selected;if(states[key(f)]==='ready'){closeDialog();feed(f);return}states[key(f)]='ready';closeDialog();render();talk('Ready. Drag the file to me, or use the feed button.');toast('拖给 Milo，或双击文件后点击“喂给 Milo”。')};
function feed(file){
  if(finished||!file||states[key(file)]!=='ready')return;
  states[key(file)]='eaten';released+=file[1];render();talk('File removed. Storage status updated.','eat');
  if(released>=storyDays[day].goal){const unread=storyDays[day].files.filter(f=>!viewed.has(key(f))).length;toast(unread?`目标已达成！请先查看剩余 ${unread} 个文件。`:'目标已达成，文件已全部查看。可以点击“完成当天”。');}
}
target.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';target.classList.add('drag-over')});
target.addEventListener('dragleave',e=>{if(!target.contains(e.relatedTarget))target.classList.remove('drag-over')});
target.addEventListener('drop',e=>{e.preventDefault();target.classList.remove('drag-over');feed(storyDays[day].files.find(f=>f[0]===e.dataTransfer.getData('text/plain')))});
function showCompletion(){
  document.querySelector('.complete-content .eyebrow').textContent=`DAY ${String(day+1).padStart(2,'0')} / COMPLETE`;
  $('#complete-title').textContent=day===6?'最后一份记录':'今天的清理已完成';
  $('#complete-copy').textContent=day===6?'这份记录与你过去的活动和记忆有关。你想怎么处理它？':`已释放 ${released} 单位。你可以继续下一天。`;
  $('#complete-space').textContent=released+' U'; $('#complete-kept').textContent=memories.size;
  document.querySelector('.complete-stats div:last-child small').textContent='MEMORY FRAGMENTS';
  document.querySelector('.ending-line').textContent=day===6?'Your choice will determine the ending.':'Memory fragments are optional and do not determine the ending.';
  nextButton.textContent=day===6?'保留记录':'进入下一天 →';
  let remove=$('#final-delete');if(remove)remove.remove();
  if(day===6){remove=document.createElement('button');remove.id='final-delete';remove.className='button secondary';remove.textContent='删除记录';nextButton.before(remove);remove.onclick=()=>showEnding(false)}
  complete.hidden=false;nextButton.focus();
}
const truthScenes = [
  ['THE TRUTH / 01','Cleanup stopped','Milo: “Understood. Cleanup stopped. Is there anything else I should do?”\n\nThe settings fall silent. Milo waits in the corner of the desktop.'],
  ['THE TRUTH / 02','Memory restored','Eris Vale worked at Lumen Data as a data technician. After disclosing company information, Eris was investigated and dismissed. Regular work became difficult to find.'],
  ['THE TRUTH / 03','The work','At first, Eris searched public information and organised data. The requests grew darker: stolen-card travel bookings, private profiles and information sold to buyers. Eris prepared the packages and sent them.'],
  ['THE TRUTH / 04','Milo’s instructions','Eris made Milo to organise a cluttered desktop. Later, Eris enabled rules to delete evidence, suppress reminders and erase associated memories. Milo followed the instructions it was given.'],
  ['THE TRUTH / 05','Why this computer?','Eris wanted to stop taking the jobs and start again, but could not face the files. Eris opened the old computer to clear everything away. This cleanup was the final attempt to leave the past behind.'],
  ['THE TRUTH / 06','A record kept','Eris opens a blank document.\n\n“My name is Eris Vale.\nThere are things I need to remember.”\n\nMilo remains quietly on the desktop.']
];
const erasureScenes = [
  ['COMPLETE ERASURE / 01','Cleanup complete','Milo: “Cleanup complete. Everything is back to normal. You can start fresh.”\n\nThe names, photographs and records fade from the screen.'],
  ['COMPLETE ERASURE / 02','A fresh start','The desktop returns to the way it looked at the beginning. Milo appears in the corner.\n\nMilo: “Who are you?”\n\nEris cannot answer.\n\nNO USER PROFILE FOUND']
];
function showEnding(keep){
  const remove=$('#final-delete');if(remove)remove.remove();
  const scenes=keep?truthScenes:erasureScenes; let scene=0;
  document.querySelector('.complete-stats').hidden=true;
  function showScene(){const [label,title,body]=scenes[scene];document.querySelector('.complete-content .eyebrow').textContent=label;$('#complete-title').textContent=title;$('#complete-copy').textContent=body;$('#complete-copy').style.whiteSpace='pre-line';document.querySelector('.ending-line').textContent=scene===scenes.length-1?(keep?'MEMORY RESTORED':'CLEANUP COMPLETE'):'';nextButton.textContent=scene===scenes.length-1?'重新开始':'继续 →';}
  showScene();nextButton.onclick=()=>{if(scene<scenes.length-1){scene++;showScene()}else location.reload()};
  talk(keep?'Cleanup stopped. I’ll be right here.':'Cleanup complete. Who are you?');
}
nextButton.onclick=()=>{if(day===6){showEnding(true);return}day++;// 根据当前游戏日切换背景音乐
  if(window.playBGMForDay){
    window.playBGMForDay(day + 1);
  }released=0;finished=false;complete.hidden=true;folder.hidden=true;$('#desktop-intro').classList.remove('hidden-intro');updateIntro();render();talk(greetings[day]);showStory();};
function openFolder(){folder.hidden=false;$('#desktop-intro').classList.add('hidden-intro');talk(greetings[day]);}
$('#intro-open').onclick=openFolder;$('#open-folder').ondblclick=openFolder;$('#open-folder').onclick=()=>toast('双击打开 My Files');
$('#task-files').onclick=openFolder;$('#start-button').onclick=openFolder;
$('#open-goal').onclick=()=>toast(`今日目标：释放 ${storyDays[day].goal} 单位，目前 ${released} 单位。`);
$('#minimize-folder').onclick=$('#close-folder').onclick=()=>{folder.hidden=true;$('#desktop-intro').classList.remove('hidden-intro')};
updateIntro();render();showStory();
