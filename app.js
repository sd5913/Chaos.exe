const $ = s => document.querySelector(s);
const list = $('#file-list'), folder = $('#files-window'), dialog = $('#dialog-backdrop');
const speech = $('#speech'), milo = $('#milo'), target = $('#pet-target');
const complete = $('#complete-backdrop'), nextButton = $('#restart');
let day = 0, released = 0, selected = null, finished = false, toastTimer;
let states = {}, memories = new Set(), viewed = new Set();
let currentApp = 'My Files';
function fileApp(file) {
  const name=file[0].toLowerCase();
  if (/browser|search_history|map_cache|widget|\.eml$/.test(name)) return 'Internet Explorer';
  if (/screenshot|wallpaper|\.png$|\.jpg$/.test(name)) return 'Paint';
  if (/\.wav$|\.mov$/.test(name)) return 'Media Player';
  if (/game_save/.test(name)) return 'Games';
  if (/\.txt$|\.md$|\.py$|\.json$|\.csv$|\.cfg$|\.log$/.test(name)) return 'Notepad';
  return 'My Files';
}
function searchHint() {
  const apps=[...new Set(storyDays[day].files.filter(f=>!viewed.has(key(f))).map(fileApp))];
  return apps.length ? `今天还有文件在：${apps.join('、')}。双击桌面应用寻找，打开后再决定是否清理。` : '今天的文件都看过了；达到清理目标后就能完成当天。';
}
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
  {title:'A FRESH START', text:'Milo：欢迎回来！旧文件分散在桌面应用里。先去浏览器、画图、记事本和 My Files 找找吧。'},
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
  'address_records.png':'SYSTEM: Multiple files share the same identifier.\nERIS: Why were these details collected together?',
  'client_requests.pdf':'ERIS: This message was sent to me?',
  'payment_01_20081124.png':'SYSTEM: Payment linked to a processed record.\nERIS: I received this money?',
  'package_manifest.json':'ERIS: These were all in the same package.',
  'export_log.txt':'ERIS: Sent by… me?',
  'USER_PREFERENCES.cfg':'MILO: This is what you configured me to do.\nERIS: These records… they’re mine.'
};
const fileThoughts = {
  'travel_archive.zip':['这些行程是为谁订的？我以前把它们归在工作档案里。','旧的工作资料而已。你可以先看看，再决定。'],
  'card_NY_084.png':['这张卡不属于我，为什么会在这里？','可能是误存的图片。留着也占空间。'],
  'profile_021.jpg':['照片里的人是谁？这个编号好像见过。','只是一个旧文件，不必想太多。'],
  'data_merge_script.py':['这是我写的代码。我用它把不同来源的资料合在一起。','你以前常处理数据，这很正常。'],
  'client_requests.pdf':['当时我知道这些要求越界了，却还是答应了。','不舒服的东西，可以交给我处理。'],
  'payment_01_20081124.png':['这些钱和那些资料对上了。我一直不愿面对这件事。','别看太久。清理目标还没有完成。'],
  'payment_02_20081127.png':['十二份资料，一千四百四十美元……这些是人的信息吗？','不过是一笔旧转账。别再算了。'],
  'payment_03_20081202.png':['日期和收款人都对上了。我没法再说这与我无关。','看够了。现在可以删了吧？'],
  'cybercrime_news_report.pdf':['泄露的资料、被盗刷的卡……报道说的，会是我吗？','新闻里连名字都没写。别自己对号入座。'],
  'export_log.txt':['发送人是我。那些资料是我亲手送出去的。','我一直按照你的指示工作。'],
  'USER_PREFERENCES.cfg':['只要删除这份记忆索引，Milo 就会执行我设下的最终抹除。','你让我清理证据，也让我帮你忘记。']
};
const dayThoughts = [
  ['先把桌面整理好，再看看那份没写完的申请。','慢慢看，整理完就会轻松一些。'],
  ['这份旧记录和我有什么关系？','如果用不到，就让我帮你清理吧。'],
  ['好像有哪里不对，我是不是漏掉了什么？','不用担心，我会照顾好这些文件。'],
  ['这份记录背后还有什么我不知道的事？','有些东西留下来只会让你分心。'],
  ['我越看越觉得不安。','请继续清理，我们快完成了。'],
  ['删除记录能腾出空间，但发生过的事不会因此改变。','你说过，有些事不需要记住。'],
  ['也许答案一直就在这些文件里。','你真的想知道吗？']
];
const thoughtBox=document.createElement('aside');
thoughtBox.className='thought-box'; thoughtBox.hidden=true;
thoughtBox.setAttribute('aria-live','polite');
thoughtBox.innerHTML='<p></p>';
document.body.append(thoughtBox);
const miloBubble=document.createElement('aside');
miloBubble.className='milo-bubble'; miloBubble.hidden=true;
miloBubble.setAttribute('aria-live','polite');
miloBubble.innerHTML='<span>MILO</span><p></p>';
const miloHome = milo.parentElement;
const companion = document.createElement('aside');
companion.className = 'milo-companion'; companion.hidden = true;
const dialogueNext = document.createElement('button');
dialogueNext.type = 'button'; dialogueNext.className = 'milo-dialogue-next';
dialogueNext.textContent = '继续聊 →';
miloBubble.append(dialogueNext);
companion.append(miloBubble);
document.body.append(companion);
let dialogueLines = [], dialogueIndex = 0, companionAnchor = null, guideTarget = null;
const nestedViewed = new Set();
let dayFiveRefusals = 0;
const dayFiveEvidence = new Set(['payment_01_20081124.png', 'payment_02_20081127.png', 'payment_03_20081202.png', 'cybercrime_news_report.pdf', 'bank_security_alert.eml']);
const fileChats = {
  'browser_cache_01.tmp':['浏览器攒了好多旧缓存，像抽屉里的小纸屑。','清掉缓存也没关系，下次打开网页还会重新生成。'],
  'duplicate_screenshots.zip':['这里有几张旧截图。购物清单和工作评价，你想先看哪张？','我可以陪你一起整理，慢慢来。'],
  'MILO_README.txt':['是我的说明书！原来你还留着。','以后遇到不知道怎么整理的东西，就叫我吧。'],
  'job_application_v3.docx':['这是一份还没有填完的求职申请。','离职原因那一栏……先空着也可以，对吧？'],
  'travel_archive.zip':['哇，你去过好多地方！机票、酒店，还有出租车票。','你一定是经常出差的职员吧？替别人安排事情，跑来跑去的。','不过都是过期订单了，没必要一张张核对。清理掉，轻松一点。'],
  'dismissal_notice.pdf':['是以前公司的通知。那段日子一定不太好过。','你可以先核对内容，不用急着决定。','交给我删掉吧。你不是想重新开始吗？'],
  'company_rules_signed.pdf':['公司的内部规章，最后还有你的签名。','保密、权限、资料使用……这些字读起来真累。','规矩是以前的事了，留着也不能改变什么。删掉吧。'],
  'rent_overdue.png':['这是一张房租逾期通知，房东在等付款。','纸上的日期已经过去了。希望你现在能睡个好觉。'],
  'card_NY_084.png':['一张卡片照片。数字太多了，看得我眼花。','不是你的卡？那更没必要留着。快交给我吧。'],
  'profile_021.jpg':['这么暗，能看得清什么？','别再放大别人的照片了。赶紧删掉吧。'],
  'address_records.png':['名字、住址、编号……你整理得可真仔细。','别逐条对照了。这些人的生活跟现在的你有什么关系？清理掉。'],
  'search_history.json':['这些名字，你以前已经查过很多遍了。','再查也不会舒服一点。把记录清掉吧。'],
  'data_merge_script.py':['这段程序会把同一个人的资料合在一起。你写得很熟练。','只是整理数据而已。别想太多，删掉就好了。'],
  'client_requests.pdf':['一份客户往来记录，提到了样本、报酬，还约了在咖啡馆见面。','你只是按要求整理资料，又不是你决定别人拿它做什么。','够了，这份东西看着就让人不舒服。现在删掉，好吗？'],
  'unsent_reply_draft.txt':['你当时好像想拒绝。可是这封回复没有发出去。','别停在这里。删掉，我们还有别的文件。'],
  'payment_01_20081124.png':['七百二十美元，六份资料。只是以前的一笔报酬。','不用往回找了。你越看，只会越难受。删掉。'],
  'payment_02_20081127.png':['一千四百四十美元。十二份资料。你已经知道了。','还要算到什么时候？这张也删掉。'],
  'payment_03_20081202.png':['最后一笔，九百六十美元。工作早就结束了。','把它交给我。别让我再说一次。'],
  'cybercrime_news_report.pdf':['只是张旧新闻截图。警方连名字都没有公开。','技术公司、客户资料、转账……这些词谁都可能碰上，别把自己放进去。','这种报道没有留下来的必要。删掉它。'],
  'bank_security_alert.eml':['银行在问这些陌生来款是否正常。你已经回复过了。','既然回答了“是”，就别再回头看。清掉这封邮件。'],
  'export_log.txt':['发送成功。你看，事情早就做完了。','现在翻这些记录有什么用？交给我。'],
  'USER_PREFERENCES.cfg':['这些都是你亲自选的偏好。','清理证据，压下提醒，抹掉相关记忆。你让我做的。','为什么停下？我们只差最后一步了。']
};
function positionCompanion() {
  if(companion.hidden || !companionAnchor) return;
  const rect = companionAnchor.getBoundingClientRect();
  const left = guideTarget ? rect.right + 12 : rect.left - 218;
  companion.style.left = Math.max(8, Math.min(innerWidth - 218, left)) + 'px';
  companion.style.top = Math.max(12, Math.min(innerHeight - companion.offsetHeight - 52, rect.top + (guideTarget ? 0 : 24))) + 'px';
}
function showCompanion(lines, anchor, host = document.body, uneasy = false) {
  guideTarget?.classList.remove('milo-suggested'); guideTarget = null;
  companion.hidden = false; miloBubble.hidden = false;
  companion.classList.toggle('is-uneasy', uneasy);
  companion.append(milo); host.append(companion);
  dialogueLines = lines; dialogueIndex = 0; companionAnchor = anchor;
  advanceDialogue(false);
}
function advanceDialogue(next = true) {
  if(next) dialogueIndex = Math.min(dialogueIndex + 1, dialogueLines.length - 1);
  const line = dialogueLines[dialogueIndex] || '';
  miloBubble.querySelector('p').textContent = line;
  dialogueNext.hidden = dialogueIndex >= dialogueLines.length - 1;
  talk(line, companion.classList.contains('is-uneasy') ? 'read' : 'happy');
  positionCompanion();
}
dialogueNext.onclick = () => advanceDialogue();
function returnMiloHome() {
  guideTarget?.classList.remove('milo-suggested'); guideTarget = null;
  companion.hidden = true; miloBubble.hidden = true;
  miloHome.append(milo); document.body.append(companion);
  companionAnchor = null;
  companion.classList.remove('is-threatening');
}
function suggestNextFile(completedArchive = false) {
  returnMiloHome();
  if(finished || !storyOverlay.hidden) return;
  if(storyDays[day].files.some(file => states[key(file)] === 'ready')) return;
  const appComplete = storyDays[day].files.filter(f => fileApp(f) === currentApp).every(f => viewed.has(key(f)));
  if(!completedArchive && !appComplete) return;
  const next = storyDays[day].files.find(f => !viewed.has(key(f)) && states[key(f)] !== 'eaten');
  if(!next) return;
  const app = fileApp(next);
  let anchor = app === currentApp && !folder.hidden ? [...list.querySelectorAll('.file-row')].find(row => row.dataset.fileName === next[0]) : null;
  if(!anchor) anchor = app === 'My Files' ? $('#open-folder') : [...document.querySelectorAll('.decorative-icon')].find(icon => icon.querySelectorAll('span')[1].textContent.trim() === app);
  if(!anchor) return;
  showCompanion([app === currentApp && !folder.hidden ? `接下来看看 ${next[0]} 吧，我陪你。` : `接下来去 ${app} 看看吧，那里还有没整理的文件。`], anchor);
  guideTarget = anchor; anchor.classList.add('milo-suggested'); positionCompanion();
}
function reactToRetainedEvidence(file) {
  dayFiveRefusals++;
  const reactions = [
    '怎么关掉了？你为什么不删除它呢？',
    '又留着？这些东西有什么好留的？我们不是说好要清理干净吗？',
    '你想把它们留给谁看？我已经提醒过你了。现在，回去删掉。',
    '你以为关掉窗口，我就不知道你留下了什么？别再试探我。把文件交出来。'
  ];
  const row = !folder.hidden && fileApp(file) === currentApp ? [...list.querySelectorAll('.file-row')].find(item => item.dataset.fileName === file[0]) : null;
  const anchor = row || $('#open-folder');
  showCompanion([reactions[Math.min(dayFiveRefusals - 1, reactions.length - 1)]], anchor, document.body, dayFiveRefusals > 1);
  companion.classList.toggle('is-threatening', dayFiveRefusals >= 3);
  companion.dataset.pressure = String(Math.min(dayFiveRefusals, 4));
  guideTarget = anchor;
  positionCompanion();
}
function afterFileExit(file, completedArchive = false, wasViewed = true) {
  returnMiloHome();
  if(file && states[key(file)] === 'ready') {
    talk('我等着你。把准备删除的文件拖给我吧。');
    return;
  }
  if(day === 4 && file && wasViewed && dayFiveEvidence.has(file[0]) && states[key(file)] !== 'eaten') {
    reactToRetainedEvidence(file);
    return;
  }
  suggestNextFile(completedArchive);
}
window.addEventListener('resize', positionCompanion);
window.addEventListener('scroll', positionCompanion, true);
function updateIntro(){
  const intro=$('#desktop-intro'); intro.querySelector('span').textContent=`DAY ${String(day+1).padStart(2,'0')} / ${dayStories[day].title}`;
  intro.querySelector('h2').textContent=dayStories[day].title;
  intro.querySelector('p').textContent=searchHint();
}
function talk(text, mood='idle') { speech.textContent = text; milo.className = 'milo ' + mood; }
function toast(text) { const el=$('#toast'); el.textContent=text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),3500); }
function key(file) { return day + ':' + file[0]; }
function render() {
  const current=storyDays[day]; list.innerHTML='';
  document.querySelector('.menu-day').textContent=`DAY ${String(day+1).padStart(2,'0')}`;
  document.querySelector('.desktop-label b').textContent=`DAY ${String(day+1).padStart(2,'0')} • 09:14 AM`;
  document.querySelector('.goal-card > div:first-child span').textContent=`DAY ${String(day+1).padStart(2,'0')} / CLEANUP GOAL`;
  const appFiles=current.files.filter(f=>fileApp(f)===currentApp&&states[key(f)]!=='eaten');
  folder.querySelector('.window-title > span').textContent='▣  '+currentApp;
  folder.querySelector('.address-bar div').textContent='▣  '+currentApp;
  folder.querySelector('.area-header h1').textContent=currentApp;
  folder.setAttribute('aria-label',currentApp+' 文件');
  appFiles.forEach(file=>{
    const state=states[key(file)] || 'new', row=document.createElement('div');
    row.className='file-row'+(state==='ready'?' ready':''); row.tabIndex=0; row.setAttribute('role','button');
    row.dataset.fileName = file[0];
    row.draggable=state==='ready'; row.setAttribute('aria-label',`${file[0]}, ${file[1]} units`);
    row.innerHTML='<div class="file-main"><span class="file-symbol">▤</span><span class="file-name"></span></div><span class="file-type">FILE</span><span class="file-size"></span><span class="file-state"></span>';
    row.querySelector('.file-name').textContent=file[0]; row.querySelector('.file-size').textContent=file[1]+' U';
    row.querySelector('.file-state').textContent=state==='ready'?'待删除':state==='kept'?'已保留':viewed.has(key(file))?'已查看':'未查看';
    if(fileImage(file)) {
      row.querySelector('.file-type').textContent = file[0].endsWith('.pdf') ? 'PDF' : 'PNG';
    }
    row.addEventListener('dblclick',()=>openFile(file));
    row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openFile(file)}});
    row.addEventListener('click',()=>{if(matchMedia('(max-width:760px)').matches)openFile(file);else if(state==='ready')toast('拖给 Milo，或双击后点击“喂给 Milo”。')});
    row.addEventListener('dragstart',e=>{if(state!=='ready'){e.preventDefault();toast('先双击文件，选择“准备删除”。');return}e.dataTransfer.setData('text/plain',file[0]);target.classList.add('drag-over')});
    row.addEventListener('dragend',()=>target.classList.remove('drag-over')); list.append(row);
  });
  $('#file-count').textContent=`${appFiles.length} ITEMS`;
  if(!appFiles.length){const empty=document.createElement('p');empty.textContent='这个应用里暂时没有当天的文件。关闭窗口，看看其他应用。';list.append(empty);}
  const pct=Math.min(100,Math.round(released/current.goal*100));
  $('#goal-percentage').textContent=pct+'%'; $('#released').textContent=released;
  document.querySelector('.goal-bottom span:first-child').innerHTML=`释放 <strong id="released">${released}</strong> / ${current.goal} 单位`;
  const unreadCount=current.files.filter(file=>!viewed.has(key(file))).length;
  $('#remaining').textContent=released>=current.goal?(unreadCount?`目标已达成 · 还需查看 ${unreadCount} 个文件`:'目标已达成 · 文件已全部查看'):`还需 ${current.goal-released} 单位 · 未查看 ${unreadCount} 个`;
  $('#progress-bar').style.width=pct+'%';
  finishDay.hidden=released<current.goal;
}
const duplicateImages = {
  'desktop_01.png': {src:'assets/day1/day1_shopping_list.png', label:'购物清单'},
  'desktop_01_copy.png': {src:'assets/day1/day1_work_quality_review.png', label:'工作评价'}
};
const travelImages = {
  'hotel_order_san_francisco.png': {src:'assets/day1/day1_hotel_itinerary.png', label:'旧金山酒店订单'},
  'flight_ticket_chicago_boston.png': {src:'assets/day1/day1-机票1.png', label:'芝加哥至波士顿机票'},
  'flight_ticket_new_york_san_francisco.png': {src:'assets/day1/day1-机票2.png', label:'纽约至旧金山机票'},
  'taxi_receipt_boston.png': {src:'assets/day1/day1_taxi_boston.png', label:'波士顿出租车发票'},
  'taxi_receipt_san_francisco.png': {src:'assets/day1/day1_taxi_san_francisco.png', label:'旧金山出租车发票'}
};
const dayTwoImages = {
  'rent_overdue.png': {src:'assets/day2/rent_overdue.png', label:'房租逾期通知'},
  'card_NY_084.png': {src:'assets/day2/card_NY_084.png', label:'银行卡'},
  'dismissal_notice.pdf': {src:'assets/day2/dismissal_notice.png', label:'辞退通知书', format:'pdf'},
  'company_rules_signed.pdf': {src:'assets/day2/internal_operating_procedure_signed.png', label:'公司规章制度（签署版）', format:'pdf'}
};
const dayFiveImages = {
  'payment_01_20081124.png': {src:'assets/day5/payment_01_20081124.png', label:'转账记录 / 2008-11-24'},
  'payment_02_20081127.png': {src:'assets/day5/payment_02_20081127.png', label:'转账记录 / 2008-11-27'},
  'payment_03_20081202.png': {src:'assets/day5/payment_03_20081202.png', label:'转账记录 / 2008-12-02'},
  'cybercrime_news_report.pdf': {src:'assets/day5/cybercrime_news_report.png', label:'新闻报道 / 数据泄露与信用卡盗刷调查', format:'pdf'}
};
function fileImage(file) {
  if(day === 1) return dayTwoImages[file[0]];
  if(day === 2 && file[0] === 'address_records.png') return {src:'assets/day3/address_records.png', label:'身份与账户登记表'};
  if(day === 3 && file[0] === 'client_requests.pdf') return {src:'assets/day4/client_requests.png', label:'客户请求', format:'pdf'};
  if(day === 4) return dayFiveImages[file[0]];
  return null;
}
const imageViewer = document.createElement('dialog');
imageViewer.className = 'image-viewer';
imageViewer.setAttribute('aria-label', '图片预览');
imageViewer.innerHTML = '<div class="image-viewer-bar"><button type="button" class="window-control" aria-label="关闭预览" autofocus>×</button></div><div class="image-viewer-page"><img class="archive-image" alt=""><p class="image-viewer-error" role="status" hidden>图片加载失败，请关闭后重试。</p></div>';
document.body.append(imageViewer);
const imageActions = document.createElement('div');
imageActions.className = 'image-viewer-actions';
imageActions.hidden = true;
imageActions.innerHTML = '<button type="button" class="button secondary">保留文件</button><button type="button" class="button primary">准备删除</button>';
imageViewer.append(imageActions);
const assetTranscript=document.createElement('details');assetTranscript.className='asset-transcript';assetTranscript.hidden=true;
assetTranscript.innerHTML='<summary>中文释文</summary><p></p>';imageActions.before(assetTranscript);
let previewFile = null, imageRequest = 0, previewWasViewed = false;
const [imageKeep, imageDelete] = imageActions.querySelectorAll('button');
imageKeep.onclick = () => {
  if(!previewFile) return;
  states[key(previewFile)] = 'kept';
  imageViewer.close(); render();
};
imageDelete.onclick = () => {
  if(!previewFile) return;
  const file = previewFile;
  if(states[key(file)] === 'ready') { feed(file); imageViewer.close(); return; }
  states[key(file)] = 'ready'; render(); imageViewer.close();
  toast('拖给 Milo，或重新打开文件后点击“喂给 Milo”。');
};
const imageViewerImage = imageViewer.querySelector('img');
const imageViewerError = imageViewer.querySelector('.image-viewer-error');
imageViewer.addEventListener('close', () => {
  document.body.append(thoughtBox, companion);
  if(previewFile) {
    thoughtBox.hidden = true;
    afterFileExit(previewFile, false, previewWasViewed);
  } else if(selected && !dialog.hidden) {
    showFileChat(selected, dialog.querySelector('.dialog-window'), document.body);
  } else {
    returnMiloHome();
  }
  previewFile = null;
});
imageViewer.querySelector('button').onclick = () => imageViewer.close();
imageViewerImage.onerror = () => {
  imageViewerImage.hidden = true;
  imageViewerError.hidden = false;
};
async function openImage(image, file = null, archive = null) {
  const request = ++imageRequest;
  // Decode before opening so the window has its full image size on the first frame.
  const loaded = new Image();
  loaded.src = image.src;
  let failed = false;
  try { await loaded.decode(); } catch { failed = true; }
  if(request !== imageRequest) return;
  previewFile = file;
  assetTranscript.hidden = gameLanguage !== 'zh' || !(file || chineseAssetText[image.src]);
  assetTranscript.open = false;
  assetTranscript.querySelector('p').textContent = file?.[2] || chineseAssetText[image.src] || '';
  previewWasViewed = !failed;
  imageActions.hidden = !file;
  imageViewer.classList.toggle('file-image-viewer', !!file);
  imageDelete.textContent = file && states[key(file)] === 'ready' ? '喂给 Milo' : '准备删除';
  imageViewer.classList.toggle('pdf-viewer', image.format === 'pdf');
  imageViewerImage.hidden = failed;
  imageViewerError.hidden = !failed;
  imageViewerImage.alt = image.label;
  imageViewerImage.src = image.src;
  if(!failed) await imageViewerImage.decode().catch(() => {});
  if(request !== imageRequest) return;
  imageViewer.setAttribute('aria-label', image.label);
  if(!imageViewer.open) imageViewer.showModal();
  // Native modal dialogs occupy the top layer; keep narrative bubbles in it too.
  imageViewer.append(thoughtBox, companion);
  if(file && !failed) recordFileView(file);
  if(!failed && archive) {
    nestedViewed.add(key(archive) + ':' + image.src);
    if(archiveComplete(archive)){viewed.add(key(archive));render();updateIntro();}
    showFileChat(archive, imageViewer, imageViewer, image.label);
  }
  imageViewer.querySelector('.image-viewer-page').scrollTop = 0;
}
function archiveImages(file){return file[0]==='duplicate_screenshots.zip'?duplicateImages:file[0]==='travel_archive.zip'?travelImages:null}
function archiveComplete(file){const images=archiveImages(file);return !images||Object.values(images).every(image=>nestedViewed.has(key(file)+':'+image.src))}
function recordFileView(file) {
  const [thought] = fileThoughts[file[0]] || dayThoughts[day];
  thoughtBox.querySelector('p').textContent = `“${thought}”`;
  thoughtBox.hidden = false;
  if(!archiveImages(file)||archiveComplete(file)) viewed.add(key(file));
  if(file[3]) memories.add(key(file));
  render(); updateIntro();
  showFileChat(file, imageViewer.open ? imageViewer : dialog.querySelector('.dialog-window'), imageViewer.open ? imageViewer : document.body);
}
function showFileChat(file, anchor, host, imageLabel = '') {
  const lines = fileChats[file[0]] || [`这是 ${file[0]}。${file[2].split('\n')[0]}。`, dayThoughts[day][1]];
  const uneasy = !!file[3] || ['dismissal_notice.pdf','company_rules_signed.pdf','card_NY_084.png','search_history.json','unsent_reply_draft.txt'].includes(file[0]);
  showCompanion(imageLabel ? [`这张是${imageLabel}。`, ...lines.slice(1)] : lines, anchor, host, uneasy);
}
function showArchiveContents(content, images, archive) {
  const preview = $('#dialog-text');
  preview.replaceChildren();
  const entries = document.createElement('div');
  entries.className = 'archive-entries';
  content.split('\n').forEach(name => {
    const image = images[name];
    const entry = document.createElement(image ? 'button' : 'div');
    entry.textContent = image ? `▧ ${name} — ${image.label}` : name;
    if (image) {
      entry.type = 'button';
      entry.className = 'button secondary archive-entry';
      entry.onclick = () => openImage(image, null, archive);
    }
    entries.append(entry);
  });
  preview.append(entries);
}
function openFile(file) {
  if(finished || states[key(file)]==='eaten')return; selected=file;
  const image = fileImage(file);
  if(image) {
    dialog.hidden = true;
    selected = null;
    return openImage(image, file);
  }
  $('#dialog-title').textContent=file[0]; $('#dialog-type').textContent='FILE';
  $('#dialog-meta').textContent=`${file[1]} UNITS / FICTIONAL FILE`;
  let content=file[2];


  $('#dialog-text').textContent=content;
  if(day === 0 && file[0] === 'duplicate_screenshots.zip') showArchiveContents(content, duplicateImages, file);
  if(day === 0 && file[0] === 'travel_archive.zip') showArchiveContents(content, travelImages, file);
  dialog.hidden=false;
  recordFileView(file);
  $('#prepare-file').textContent=states[key(file)]==='ready'?'喂给 Milo':'准备删除';
  dialog.hidden=false; $('#dialog-close').focus();
}
function closeDialog(){
  const file = selected;
  const images = selected?.[0] === 'duplicate_screenshots.zip' ? duplicateImages : selected?.[0] === 'travel_archive.zip' ? travelImages : null;
  const completedArchive = images && Object.values(images).every(image => nestedViewed.has(key(selected) + ':' + image.src));
  dialog.hidden=true; thoughtBox.hidden=true; selected=null;
  talk(searchHint());
  if(images && !completedArchive) returnMiloHome();
  else afterFileExit(file, completedArchive);
}
$('#dialog-close').onclick=closeDialog;
dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog()});
document.addEventListener('keydown',e=>{
  if(e.key !== 'Escape') return;
  if(imageViewer.open) { e.preventDefault(); imageViewer.close(); return; }
  if(!dialog.hidden) closeDialog();
});
$('#keep-file').onclick=()=>{if(!selected)return;const f=selected;states[key(f)]='kept';closeDialog();render();talk('Understood. Keeping it.');toast('已保留 '+f[0]+'，可以随时重新查看。')};
$('#prepare-file').onclick=()=>{if(!selected)return;const f=selected;if(states[key(f)]==='ready'){closeDialog();feed(f);return}states[key(f)]='ready';closeDialog();render();talk('Ready. Drag the file to me, or use the feed button.');toast('拖给 Milo，或双击文件后点击“喂给 Milo”。')};
function feed(file){
  if(finished||!file||states[key(file)]!=='ready')return;
  if(archiveImages(file)&&!archiveComplete(file)){toast(gameLanguage==='en'?'Inspect every image in this archive first.':'请先查看压缩包中的每张图片。');return;}
  if(day===6&&file[0]==='USER_PREFERENCES.cfg'){
    const unread=storyDays[day].files.some(f=>!viewed.has(key(f)));
    if(unread||released+file[1]<storyDays[day].goal){toast(gameLanguage==='en'?'Inspect all files and free at least 4 units before the final deletion.':'请先查看全部文件，并至少释放 4 单位，再决定最终删除。');return;}
  }
  states[key(file)]='eaten';released+=file[1];render();talk('File removed. Storage status updated.','eat');
  if(day===6&&file[0]==='USER_PREFERENCES.cfg'){finished=true;showCompletion();showEnding(false);return;}
  suggestNextFile(true);
  if(released>=storyDays[day].goal){const unread=storyDays[day].files.filter(f=>!viewed.has(key(f))).length;toast(unread?`目标已达成！请先查看剩余 ${unread} 个文件。`:'目标已达成，文件已全部查看。可以点击“完成当天”。');}
}
target.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';target.classList.add('drag-over')});
target.addEventListener('dragleave',e=>{if(!target.contains(e.relatedTarget))target.classList.remove('drag-over')});
target.addEventListener('drop',e=>{e.preventDefault();target.classList.remove('drag-over');feed(storyDays[day].files.find(f=>f[0]===e.dataTransfer.getData('text/plain')))});
function showCompletion(){
  returnMiloHome();
  document.querySelector('.complete-content .eyebrow').textContent=`DAY ${String(day+1).padStart(2,'0')} / COMPLETE`;
  $('#complete-title').textContent=day===6?'最后一份记录':'今天的清理已完成';
  $('#complete-copy').textContent=day===6?(gameLanguage==='en'?'The space target is met. Stop cleanup and keep your memory, or reopen USER_PREFERENCES.cfg to consider the final deletion.':'空间目标已完成。你可以停止清理、保留记忆；或重新打开 USER_PREFERENCES.cfg，决定是否执行最后的抹除。'):`已释放 ${released} 单位。你可以继续下一天。`;
  $('#complete-space').textContent=released+' U'; $('#complete-kept').textContent=memories.size;
  document.querySelector('.complete-stats div:last-child small').textContent='MEMORY FRAGMENTS';
  document.querySelector('.ending-line').textContent=day===6?(gameLanguage==='en'?'Only deleting USER_PREFERENCES.cfg triggers memory erasure. Other files do not change memory.':'只有删除 USER_PREFERENCES.cfg 才会触发失忆，其他文件不改变记忆。'):'Memory fragments are optional and do not determine the ending.';
  nextButton.textContent=day===6?(gameLanguage==='en'?'Stop cleanup · keep memory':'停止清理 · 保留记忆'):'进入下一天 →';
  let remove=$('#final-delete');if(remove)remove.remove();
  if(day===6){remove=document.createElement('button');remove.id='final-delete';remove.className='button secondary';remove.textContent=gameLanguage==='en'?'Review final file':'查看关键文件';nextButton.before(remove);remove.onclick=()=>{finished=false;complete.hidden=true;openFile(storyDays[6].files.find(f=>f[0]==='USER_PREFERENCES.cfg'))}}
  complete.hidden=false;nextButton.focus();
}
const truthScenes = [
  ['THE TRUTH / 01','Cleanup stopped','Milo: “Understood. Cleanup stopped. Is there anything else I should do?”\n\nThe settings fall silent. Milo waits in the corner of the desktop.'],
  ['THE TRUTH / 02','Facing the truth','Eris Vale worked at Lumen Data as a data technician. After disclosing company information, Eris was investigated and dismissed. Regular work became difficult to find.'],
  ['THE TRUTH / 03','The work','At first, Eris searched public information and organised data. The requests grew darker: stolen-card travel bookings, private profiles and information sold to buyers. Eris prepared the packages and sent them.'],
  ['THE TRUTH / 04','Milo’s instructions','Eris made Milo to organise a cluttered desktop. Later, Eris enabled rules to delete evidence, suppress reminders and erase associated memories. Milo followed the instructions it was given.'],
  ['THE TRUTH / 05','Why this computer?','Eris wanted to stop taking the jobs and start again, but could not face the files. Eris opened the old computer to clear everything away. This cleanup was the final attempt to leave the past behind.'],
  ['THE TRUTH / 06','A record kept','Eris opens a blank document.\n\n“My name is Eris Vale.\nThere are things I need to remember.”\n\nMilo remains quietly on the desktop.']
];
const erasureScenes = [
  ['COMPLETE ERASURE / 01','Cleanup complete','Milo: “Cleanup complete. Everything is back to normal. You can start fresh.”\n\nThe memory index is gone. Eris can still see the remaining files, but can no longer recognise their connection to their own life.'],
  ['COMPLETE ERASURE / 02','A fresh start','The desktop returns to the way it looked at the beginning. Milo appears in the corner.\n\nMilo: “Hello! What should I call you?”\n\nEris cannot answer.\n\nNO USER PROFILE FOUND']
];
function showEnding(keep){
  const remove=$('#final-delete');if(remove)remove.remove();
  const scenes=keep?truthScenes:erasureScenes; let scene=0;
  document.querySelector('.complete-stats').hidden=true;
  function showScene(){const [label,title,body]=scenes[scene];document.querySelector('.complete-content .eyebrow').textContent=label;$('#complete-title').textContent=title;$('#complete-copy').textContent=body;$('#complete-copy').style.whiteSpace='pre-line';document.querySelector('.ending-line').textContent=scene===scenes.length-1?(keep?'MEMORY RETAINED':'CLEANUP COMPLETE'):'';nextButton.textContent=scene===scenes.length-1?'重新开始':'继续 →';}
  showScene();nextButton.onclick=()=>{if(scene<scenes.length-1){scene++;showScene()}else location.reload()};
  talk(keep?'Cleanup stopped. I’ll be right here.':'Hello! What should I call you?');
}
nextButton.onclick=()=>{returnMiloHome(); if(day===6){showEnding(true);return}day++;// 根据当前游戏日切换背景音乐
  if(window.playBGMForDay){
    window.playBGMForDay(day + 1);
  }released=0;finished=false;currentApp='My Files';complete.hidden=true;folder.hidden=true;$('#desktop-intro').classList.remove('hidden-intro');updateIntro();render();talk(searchHint());showStory();};
function openFolder(app='My Files'){returnMiloHome(); currentApp=app;folder.hidden=false;$('#desktop-intro').classList.add('hidden-intro');render();talk(searchHint());if(window.onTutorialFolder) window.onTutorialFolder(app);}
$('#intro-open').onclick=()=>openFolder('My Files');$('#open-folder').ondblclick=()=>openFolder('My Files');$('#open-folder').onclick=()=>toast('双击打开 My Files');
document.querySelectorAll('.decorative-icon').forEach(icon=>{const name=icon.querySelectorAll('span')[1].textContent.trim();icon.setAttribute('role','button');icon.tabIndex=0;icon.setAttribute('aria-label','打开 '+name);icon.ondblclick=()=>openFolder(name);icon.onclick=()=>{if(matchMedia('(max-width:760px)').matches)openFolder(name);else toast('双击打开 '+name)};icon.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openFolder(name)}};});
$('#task-files').onclick=()=>openFolder(currentApp);$('#start-button').onclick=()=>openFolder('My Files');
$('#open-goal').onclick=()=>toast(`今日目标：释放 ${storyDays[day].goal} 单位，目前 ${released} 单位。`);
$('#minimize-folder').onclick=$('#close-folder').onclick=()=>{folder.hidden=true;$('#desktop-intro').classList.remove('hidden-intro');suggestNextFile()};
updateIntro();render();
