const entrance = document.createElement('section');
entrance.className = 'entrance'; entrance.setAttribute('aria-label', 'Welcome to CLEAN.exe');
entrance.innerHTML = `<div class="cover image-cover" id="cover"><h1 class="sr-only">CLEAN.exe</h1><img class="cover-art" src="assets/cover/milo-ring-cover-blue-v2.png" alt="" fetchpriority="high"><button id="enter-game" class="cover-start" type="button" aria-label="Start game"><span class="sr-only">START GAME</span></button></div><div class="welcome-card" id="language-screen" hidden><div class="cover-milo milo happy" role="img" aria-label="Milo"></div><p class="cover-kicker">MILO / YOUR PERSONAL CLEANUP ASSISTANT</p><h2>Hello. Let's find the right words.</h2><p>Which language feels like home?<br>你想用哪种语言和我聊天？</p><div class="language-options"><button class="button primary" data-language="en">English</button><button class="button primary" data-language="zh">中文</button></div></div>`;
document.body.append(entrance);
$('#desktop').inert=true;
$('#enter-game').onclick = () => { $('#cover').hidden = true; $('#language-screen').hidden = false; $('#language-screen button').focus(); };
let tutorialPhase = 'welcome';
const welcomeLines = {
 en: ["Hello! I'm Milo, your personal cleanup assistant. I'll keep you company while we sort this computer out.", "Each day, explore the desktop apps and open every file. Read carefully, then choose what to keep and what to feed to me.", "Preparing a file for deletion doesn't remove it. Drag it to me, or open it again and choose Feed Milo. We have a storage target to meet each day.", "Please don't skip any files. Not even one. I just want to be sure nothing has been... overlooked.", "Once you've viewed everything and met the cleanup target, we can move on together. Your choices about what to keep are still yours.", "Are you ready to start everything over?"],
 zh: ['你好！我是 Milo，你的私人清理助手。整理这台电脑的时候，我会一直陪着你。','每天去桌面的应用里找找，打开每一个文件。仔细看看，再决定保留，还是喂给我。','选择“准备删除”还不算清理完成。把文件拖给我，或者重新打开后选择“喂给 Milo”。每天都需要达到清理目标。','请不要跳过任何文件。一个都不行哦。我只是想确定，没有什么东西被……遗漏。','所有文件都看过，并达到清理目标后，我们才能进入下一天。至于哪些要留下，当然还是由你决定。','准备好重新开始一切了吗？']
};
const welcome = document.createElement('section'); welcome.className='welcome-dialog';welcome.hidden=true;
welcome.innerHTML='<div class="welcome-card"><div class="cover-milo milo happy" role="img" aria-label="Milo"></div><p class="cover-kicker">MILO / ONLINE</p><p class="welcome-copy" aria-live="polite"></p><div class="welcome-progress"></div><button class="button primary" id="welcome-next"></button></div>';
document.body.append(welcome);
entrance.querySelectorAll('[data-language]').forEach(button => button.onclick = () => {
  setGameLanguage(button.dataset.language);
  entrance.hidden=true; document.body.classList.remove('booting');
  welcome.hidden=false; let step=0;
  const draw=()=>{welcome.querySelector('.welcome-copy').textContent=welcomeLines[gameLanguage][step];welcome.querySelector('.welcome-progress').textContent=`${step+1} / ${welcomeLines[gameLanguage].length}`;$('#welcome-next').textContent=gameLanguage==='zh'?(step===5?'准备好了 →':'继续 →'):(step===5?"I'm ready →":'Continue →');$('#welcome-next').focus();};
  $('#welcome-next').onclick=()=>{if(step<5){step++;draw();}else{welcome.hidden=true;$('#desktop').inert=false;tutorialPhase='folder';showCompanion([gameLanguage==='zh'?'我们从 My Files 开始。双击这个文件夹，我在这里等你。':"Let's start with My Files. Double-click this folder. I'll wait right here."],$('#open-folder'));guideTarget=$('#open-folder');guideTarget.classList.add('milo-suggested');positionCompanion();}};
  draw();
});
window.onTutorialFolder = app => {
  if(tutorialPhase!=='folder'||app!=='My Files')return;
  tutorialPhase='file';
  const first=storyDays[0].files.find(file=>fileApp(file)==='My Files');
  const row=[...list.querySelectorAll('.file-row')].find(item=>item.dataset.fileName===first[0]);
  if(row){showCompanion([gameLanguage==='zh'?`很好。现在双击 ${first[0]}，我们一起看看里面有什么。`:`Good. Now double-click ${first[0]}. Let's see what's inside.`],row);guideTarget=row;row.classList.add('milo-suggested');positionCompanion();}
};
$('#enter-game').focus();
