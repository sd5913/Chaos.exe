let gameLanguage = 'en';
const englishText = new Map();
function registerTranslation(zh,en){englishText.set(zh,en);}
const uiPairs = {
 '双击打开':'Double-click to open','清理目标':'Cleanup goal','一切，从':'Everything begins','整理开始。':'with a clean slate.','打开一个文件，看看里面是什么，再决定要不要喂给 Milo。':'Open a file, inspect it, then decide whether to feed it to Milo.','这是虚拟桌面，所有文件均为游戏内容。':'A fictional desktop. All files are part of the game.','双击文件查看内容，然后做出选择。':'Double-click a file to inspect it, then make your choice.','我的文件':'My Files','虚拟桌面 / 仅供游戏演示':'Fictional desktop / Game demo','↓ 放在这里喂给 Milo':'↓ Drop here to feed Milo','把准备删除的文件拖到我这里':'Drag prepared files to me','释放':'Released','单位':'units','完成当天 →':'Finish day →','未查看':'Unread','已查看':'Viewed','待删除':'Ready to delete','已保留':'Kept','这个文件要怎么处理？':'What would you like to do with this file?','保留文件':'Keep file','准备删除':'Prepare deletion','喂给 Milo':'Feed Milo','选择“准备删除”后，拖动文件给 Milo；也可以用按钮喂给它。':'Prepare deletion, then drag the file to Milo or use Feed Milo.','继续游戏 →':'Continue →','继续聊 →':'Keep talking →','重新开始':'Start again','继续 →':'Continue →','进入下一天 →':'Next day →','保留记录':'Keep record','删除记录':'Delete record','最后一份记录':'The last record','今天的清理已完成':'Daily cleanup complete','图片加载失败，请关闭后重试。':'Image failed to load. Close and try again.','今天的文件都看过了；达到清理目标后就能完成当天。':'Every file has been viewed. Meet the cleanup target to finish the day.','我等着你。把准备删除的文件拖给我吧。':"I'll wait. Drag the prepared file to me.",'这个应用里暂时没有当天的文件。关闭窗口，看看其他应用。':'No files here today. Close this window and try another app.','双击打开 My Files':'Double-click to open My Files','怎么关掉了？你为什么不删除它呢？':"Why did you close it? Why won't you delete it?",'又留着？这些东西有什么好留的？我们不是说好要清理干净吗？':"Keeping it again? What's worth keeping? Didn't we agree to clean everything?",'你想把它们留给谁看？我已经提醒过你了。现在，回去删掉。':"Who are you keeping them for? I've already warned you. Go back and delete them.",'你以为关掉窗口，我就不知道你留下了什么？别再试探我。把文件交出来。':"You think closing the window hides what you've kept? Stop testing me. Hand over the file.",'拖给 Milo，或重新打开文件后点击“喂给 Milo”。':'Drag it to Milo, or reopen it and choose Feed Milo.','拖给 Milo，或双击文件后点击“喂给 Milo”。':'Drag it to Milo, or reopen it and choose Feed Milo.','拖给 Milo，或双击后点击“喂给 Milo”。':'Drag it to Milo, or reopen it and choose Feed Milo.','先双击文件，选择“准备删除”。':'Open the file first and choose Prepare deletion.'
};
Object.entries(uiPairs).forEach(([a,b])=>registerTranslation(a,b));
function translateGameText(text){
 if(gameLanguage==='zh')return text;
 if(englishText.has(text))return englishText.get(text);
 let result=text
 .replace(/还需 (\d+) 单位 · 未查看 (\d+) 个/,'Need $1 units · $2 unread')
 .replace(/目标已达成 · 还需查看 (\d+) 个文件/,'Target met · $1 files unread')
 .replace(/目标已达成 · 文件已全部查看/,'Target met · All files viewed')
 .replace(/请先查看今天的全部文件，还剩 (\d+) 个未查看。/,'View every file first. $1 still unread.')
 .replace(/今日目标：释放 (\d+) 单位，目前 (\d+) 单位。/,'Daily goal: release $1 units. Currently $2 units.')
 .replace(/已释放 (\d+) 单位。你可以继续下一天。/,'Released $1 units. You can continue to the next day.')
 .replace(/目标已达成！请先查看剩余 (\d+) 个文件。/,'Target met! View the remaining $1 files first.')
 .replace(/目标已达成，文件已全部查看。可以点击“完成当天”。/,'Target met and every file viewed. Choose Finish day.')
 .replace(/这张是(.+)。/,'This is $1.')
 .replace(/这是 (.+)。(.+)。/,'This is $1. $2.');
 for(const [a,b] of englishText)result=result.split(a).join(b);
 return result.replace(/今天还有文件在：(.+)。双击桌面应用寻找，打开后再决定是否清理。/,'Files remain in: $1. Open those apps and inspect every file.')
 .replace(/请先查看今天的全部文件，还剩 (\d+) 个未查看。/,'View every file first. $1 still unread.')
 .replace(/目标已达成 · 还需查看 (\d+) 个文件/,'Target met · $1 files unread').replace(/目标已达成 · 文件已全部查看/,'Target met · All files viewed')
 .replace(/还需 (\d+) units · 未查看 (\d+) 个/,'Need $1 units · $2 unread')
 .replace(/接下来去 (.+) 看看吧，那里还有没整理的文件。/,"Let's try $1 next. There are more files there.")
 .replace(/接下来看看 (.+) 吧，我陪你。/,"Let's look at $1 next. I'll be with you.")
 .replace(/已保留 (.+)，可以随时重新查看。/,'Kept $1. You can view it again.')
 .replace(/已释放 (\d+) units。你可以继续下一天。/,'Released $1 units. You can continue to the next day.')
 .replace(/DAY (\d+) \/ 今日剧情/,'DAY $1 / DAILY STORY');
}
const originalNodes=new WeakMap();let localizationObserver;
function localizeInterface(){
 localizationObserver?.disconnect();
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(node.parentElement.closest('script,style,.entrance,.welcome-dialog'))continue;
  const old=originalNodes.get(node);const source=old&&node.nodeValue===old.output?old.source:node.nodeValue;
  let output=translateGameText(source);
  if(gameLanguage==='zh'){
   output=source;
   for(const [en,zh] of Object.entries(chineseUI).sort((a,b)=>b[0].length-a[0].length)){
    const escaped=en.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    output=output.replace(new RegExp('(?<![A-Za-z])'+escaped+'(?![A-Za-z])','g'),zh);
   }
   output=output.replace(/(\d+) ITEMS/g,'$1 项');
  }
  originalNodes.set(node,{source,output});if(node.nodeValue!==output)node.nodeValue=output;
 }
 localizationObserver?.observe(document.body,{subtree:true,childList:true,characterData:true});
}
const chineseUI={'File':'文件','Edit':'编辑','View':'查看','Help':'帮助','Address':'位置','NAME':'名称','TYPE':'类型','SIZE':'大小','STATUS':'状态','YOUR COMPANION':'你的伙伴','● ONLINE':'● 在线','READY TO HELP':'随时为你服务','MILO SAYS':'MILO 说','PERSONAL COMPUTER':'个人电脑','FILE':'文件','FILE PREVIEW /':'文件预览 /','File Viewer':'文件查看器','A FRESH START':'重新开始','OLD RECORDS':'旧日记录','SOMETHING IS FAMILIAR':'似曾相识','CLIENT REQUESTS':'客户请求','PAYMENT HISTORY':'转账记录','NO MORE JUNK':'不留痕迹','COMPLETE CLEANUP':'彻底清理'};
const englishChats={
 'browser_cache_01.tmp':['The browser has collected so much old cache. Like scraps of paper in a drawer.','It is safe to clear the cache. Websites will make more next time.'],
 'duplicate_screenshots.zip':['Some old screenshots. A shopping list and a work review. Which one first?',"We can sort them together. Take your time."],
 'MILO_README.txt':["My instruction manual! You kept it.","If you don't know where something belongs, just call me."],
 'job_application_v3.docx':['An unfinished job application.','The reason for leaving... we can leave that blank, right?'],
 'travel_archive.zip':["Wow, you've been to so many places! Flights, hotels, even taxi receipts.","You must have traveled a lot for work. Arranging things for people. Always on the move.","But these bookings have expired. No need to check every detail. Clear them away. Feel lighter."],
 'dismissal_notice.pdf':["You did something rather extraordinary, didn't you? They even revoked your access.","...Don't look at me like that. What good are bad memories?","Let me delete it. You wanted a fresh start, remember?"],
 'company_rules_signed.pdf':['Internal company rules. Your signature is at the end.','Confidentiality, access, data use... such exhausting words.','Those rules belong to another time. Keeping them changes nothing. Delete it.'],
 'rent_overdue.png':['An overdue rent notice. The landlord was waiting for payment.','That date is long past. I hope you can sleep well now.'],
 'card_NY_084.png':['A photograph of a card. All those numbers make my eyes hurt.',"Not your card? Then there's even less reason to keep it. Give it to me."],
 'profile_021.jpg':["It's so dark. What could you possibly see?","Stop enlarging other people's photographs. Delete it."],
 'address_records.png':['Names, addresses, reference numbers... you were very thorough.',"Stop matching every row. What do these people's lives have to do with you now? Clear it."],
 'search_history.json':["You've searched those names so many times already.","Looking again won't make you feel better. Clear the history."],
 'data_merge_script.py':['This program combines records about the same person. You were good at it.',"Just organizing data. Don't overthink it. Delete it."],
 'client_requests.pdf':['A client message. Samples, payment, and a meeting at a cafe.',"You only organized the records. You didn't decide what anyone did with them.","Enough. This document is unpleasant. Delete it now, all right?"],
 'unsent_reply_draft.txt':['It seems you wanted to refuse. But you never sent this reply.',"Don't stop here. Delete it. There are more files."],
 'payment_01_20081124.png':['Seven hundred and twenty dollars. Six profiles. Just an old payment.',"Stop looking back. It will only hurt more. Delete it."],
 'payment_02_20081127.png':['Fourteen hundred and forty dollars. Twelve profiles. You know already.','How long will you keep counting? Delete this one too.'],
 'payment_03_20081202.png':['The last payment. Nine hundred and sixty dollars. The work ended long ago.',"Give it to me. Don't make me ask again."],
 'cybercrime_news_report.pdf':["Just an old news clipping. The police didn't even name anyone.","Technology companies, customer records, transfers... those words could describe anyone. Don't put yourself in the story.","There is no reason to keep this report. Delete it."],
 'bank_security_alert.eml':['The bank asked about unfamiliar payments. You already answered.',"You said yes. So stop looking back. Clear the message."],
 'export_log.txt':["Delivery successful. See? It was finished long ago.","What good is revisiting these records? Give them to me."],
 'USER_PREFERENCES.cfg':['You selected these preferences yourself.','Delete evidence. Suppress reminders. Erase associated memories. You asked me to.',"Why stop? We are only one step away."]
};
const chineseFiles={
 'browser_cache_01.tmp':'浏览器缓存：126 项。最后更新于 164 天前，内容已过期。',
 'duplicate_screenshots.zip':'截图备份\ndesktop_01.png\ndesktop_01_copy.png\nloading_screen.png\nloading_screen_copy.png\ncoffee_blurry.jpg',
 'MILO_README.txt':'MILO v1.0\n混乱桌面上的小伙伴。可以查找重复文件、建议清理并记住偏好。\n创建者：E. Vale。',
 'job_application_v3.docx':'求职申请\n姓名：Eris Vale\n前雇主：Lumen Data\n职位：数据技术员\n技能：数据处理、脚本、系统维护\n离职原因：__________',
 'dismissal_notice.pdf':'辞退通知书\nLumen Data 人力资源部致 Eris Vale：经调查，你未经授权泄露公司信息，雇佣关系已终止，访问权限已撤销。',
 'company_rules_signed.pdf':'公司内部操作规章（签署版）\n员工不得擅自访问、复制或外传客户个人资料。保密要求适用于客户身份、地址、账户与相关记录。',
 'rent_overdue.png':'房租逾期通知\n租客：Eris Vale。房租尚未缴纳。\n手写备注：再接一单。这样就能补上了。',
 'card_NY_084.png':'银行卡照片\nM. ROWE\n尾号：4812\n关联记录：NY-084\n预订成功。',
 'contacts_backup_OLD.vcf':'旧联系人备份：共 18 条记录，其中 11 条没有电话号码。',
 'map_cache.bin':'地图缓存：缓存的地图图片和位置数据。无法预览。',
 'untitled_notes_7.txt':'买咖啡。更新密码。给房东打电话。记得吃饭。',
 'data_merge_script.py':'数据合并脚本\n作者：E. Vale。按标识符匹配记录、删除重复项并导出整理结果。',
 'search_history.json':'最近搜索：Morgan Rowe、Morgan Rowe 的地址与行程、NY-084。\n保存到：PROFILES。',
 'address_records.png':'身份与账户登记表\n整理人：E. Vale。更新于 2008 年 11 月 18 日。\n包含六人的姓名、邮寄地址、电话、账户编号、银行卡后四位、开户日期、状态与照片文件名。\n导出前核对姓名、地址和照片。来源索引保存在 package_manifest。',
 'meeting_audio_test.wav':'录音文字：沙沙声。“测试。一、二。”',
 'installer_old.dmg':'旧版安装程序：此版本已不再受支持。',
 'empty_folder_index.dat':'文件夹索引：找到 0 项。没有可用内容。',
 'client_aliases.txt':'客户代号\nORBIT_7：行程\nNIGHTTRAIN：人物档案\nJUNO：紧急请求\n不要使用真实姓名。',
 'unsent_reply_draft.txt':'草稿——未发送\n这次请求包含家庭住址和家人信息。你确定需要全部内容吗？\n我觉得我不应该这样做。',
 'client_requests.pdf':'客户来信\n发件人：ORBIT_7；收件人：E. Vale。\n2008 年 11 月 19 日，18:42。主题：11 月记录复核。\n样本格式符合要求；下一批沿用同一模板，每条记录保留来源索引。同名记录需再次核对，不确定的条目标记待审核。周五 7:30 在上次的咖啡馆会面。范围与报价不变，如额外核查耗时增加，请先更新估价。',
 'crypto_price_widget.cache':'行情组件缓存：上次更新失败，已保存的价格已过时。',
 'game_save_backup.sav':'游戏存档：上次游玩在三年前，进度 68%。要继续吗？',
 'cybercrime_news_report.pdf':'城市纪事报 / 2008 年 12 月 4 日\n数据泄露与信用卡盗刷促使警方介入。\n近期居民个人信息遭泄露，信用卡出现未经授权的消费，警方认为事件可能有关联。泄露资料包含姓名、邮寄地址、联系方式及账户索引，部分受害者的资料曾出现在私下流转的数据包中。\n警方已联合调查，初步证据指向曾在可获取客户个人信息的技术公司工作的嫌疑人，正在审查离职员工访问日志、文件导出和来款记录。目前尚未公开身份，也未认定有罪。\n居民应检查账单、报告陌生交易，并保留有助调查的消息和文件。\n调查仍在进行。',
 'bank_security_alert.eml':'账户安全通知\n我们注意到数笔来自陌生来源的来款。这些交易是你预期的吗？\n回复：是的，这些款项是预期中的。',
 'payment_01_20081124.png':'入账详情 / 2008-11-24\nORBIT_7 → ERIS VALE，账户尾号 0217。\n金额：720 美元。批次 01：6 份档案 × 120 美元。状态：完成。',
 'payment_02_20081127.png':'入账详情 / 2008-11-27\nORBIT_7 → ERIS VALE，账户尾号 0217。\n金额：1,440 美元。批次 02：12 份档案 × 120 美元。状态：完成。',
 'payment_03_20081202.png':'入账详情 / 2008-12-02\nORBIT_7 → ERIS VALE，账户尾号 0217。\n金额：960 美元。批次 03：8 份档案 × 120 美元。状态：完成。',
 'archive_copy_FINAL.zip':'重复存档：检测到一份相同存档。',
 'temp_render_004.mov':'黑屏。进度条卡在 12%。渲染未完成。',
 'system_crash_2025.log':'系统日志：应用无响应，意外关闭。系统已成功重启。',
 'untitled_spreadsheet.csv':'未命名表格\n姓名，日期，备注\n（空白）',
 'package_manifest.json':'数据包内容：profiles/、addresses/、travel/、payment/。状态：准备导出。',
 'export_log.txt':'导出日志\n数据包已创建，记录已合并，存档已准备，导出完成。\n发送者：ERIS VALE。投递状态：完成。',
 'recycle_bin_index.db':'回收站索引：列出了已处理文件的名称，原预览不可用。',
 'desktop_layout.bak':'桌面布局备份\nMILO：右下角。\n文件夹：WORK、PERSONAL、ARCHIVE。\n壁纸：holiday_wallpaper_old.png。',
 'memory_cleanup.tmp':'临时系统文件：正在检查关联数据……关联记忆不可用。',
 'welcome_message.txt':'欢迎消息\n你好！我应该怎么称呼你？',
 'MILO_CHANGELOG.md':'MILO 更新日志\nv1.0：文件分类与重复检测。\nv1.4：自定义提醒。\nv2.1：自动清理规则。\nv2.6：抑制关联提醒。\n变更请求者：用户。',
 'USER_PREFERENCES.cfg':'用户偏好\n自动删除证据：已启用。\n抑制提醒：已启用。\n抹除关联记忆：已启用。\n配置人：ERIS VALE。'
};
const chineseAssetText={
 'assets/day1/day1_shopping_list.png':'周末购物清单\n牛奶、鸡蛋、面包、苹果、洗衣液。\n记得带购物袋。',
 'assets/day1/day1_work_quality_review.png':'每周数据质量复核\n项目：客户记录迁移。整理人：E. Vale / 数据集成工程师。复核周期：2008 年 11 月 3—7 日。\nCRM 导出：2400 条，重复 18，缺失字段 0，已完成并验证。\n支持归档：1850 条，重复 7，缺失字段 12，需复核邮编。\n账户导入：3120 条，重复 24，缺失 0，已完成，重复项已合并。\n旧数据库：960 条，重复 0，缺失 8，等待源数据更新。\n联系人同步：1470 条，重复 11，缺失 0，格式检查通过。\n导出前复核未匹配记录。仅供内部使用。',
 'assets/day1/day1_hotel_itinerary.png':'旧金山 HARBOR COURT INN 预订确认\n住客：VALE/ERIS。入住：2008 年 11 月 16 日；退房：11 月 19 日。三晚，一位成人，标准单人间，已预付。\n确认编号 HC-081116-084；已确认晚到。11 月 17—18 日为私人安排，19 日 11:00 前退房。',
 'assets/day1/day1-机票1.png':'联合航空机票\n乘客：VALE/ERIS。芝加哥 → 波士顿。\n航班 UA417；2008 年 9 月 19 日。登机口 B7，登机时间 15:45，座位 23A。提前 35 分钟到登机口。',
 'assets/day1/day1-机票2.png':'联合航空机票\n乘客：VALE/ERIS。纽约 → 旧金山。\n航班 UA948；2008 年 11 月 16 日。登机口 A11，登机时间 21:10，座位 27A。提前 35 分钟到登机口。',
 'assets/day1/day1_taxi_boston.png':'波士顿出租车收据\n2008 年 9 月 19 日 19:12。车辆 217，行程 0919084。\n车费 $27.00，机场费 $2.25，小费 $4.75，总计 $34.00。刷卡支付已批准。',
 'assets/day1/day1_taxi_san_francisco.png':'旧金山出租车收据\n2008 年 11 月 16 日 23:48。车辆 392，行程 1116392。\n车费 $39.00，机场费 $3.00，小费 $6.00，总计 $48.00。刷卡支付已批准。'
};
function setGameLanguage(language){
 gameLanguage=language;document.documentElement.lang=language==='zh'?'zh-CN':'en';
 Object.entries(englishChats).forEach(([name,lines])=>(fileChats[name]||[]).forEach((zh,index)=>registerTranslation(zh,lines[index]||lines[0])));
 const enDays=['A fresh start. Every file deserves a look.','There are old records to sort through. Look before deciding.','Some records may be connected. Take your time.','Messages and work records are waiting.','Some payments need your attention. Keep cleaning.','I will follow your preferences. Leave nothing behind.','A few files remain. Perhaps we should look at your old settings.'];
 dayStories.forEach((story,index)=>registerTranslation(story.text,enDays[index]));
 dayThoughts.forEach((pair,index)=>{registerTranslation(pair[0],["These files seem ordinary... why can't I remember them?","What does this record have to do with me?","Something is wrong. What am I missing?","What else is hidden behind this record?","The more I read, the more uneasy I feel.","If I delete this, will I still remember?","Maybe the answer was in these files all along."][index]);registerTranslation(pair[1],enDays[index]);});
 Object.entries(fileThoughts).forEach(([name,pair])=>registerTranslation(pair[0],({ 'travel_archive.zip':"These journeys... why can't I remember them?",'card_NY_084.png':"This card isn't mine. Why is it here?",'cybercrime_news_report.pdf':"Leaked data. Stolen cards. Is this story about me?"})[name]||"How am I connected to this? What have I forgotten?"));
 Object.entries({'购物清单':'shopping list','工作评价':'work review','旧金山酒店订单':'San Francisco hotel booking','芝加哥至波士顿机票':'Chicago–Boston ticket','纽约至旧金山机票':'New York–San Francisco ticket','波士顿出租车发票':'Boston taxi receipt','旧金山出租车发票':'San Francisco taxi receipt','房租逾期通知':'overdue rent notice','银行卡':'bank card','辞退通知书':'dismissal notice','公司规章制度（签署版）':'signed company rules','身份与账户登记表':'identity and account register','客户请求':'client request','转账记录':'transfer record','新闻报道 / 数据泄露与信用卡盗刷调查':'News / Data leak and card fraud inquiry','打开 My Files':'Open My Files','今日剧情':'Daily story'}).forEach(([a,b])=>registerTranslation(a,b));
 if(language==='zh'){
  greetings.forEach((line,i)=>chineseUI[line]=dayStories[i].text);
  Object.assign(chineseUI,{'Cleanup stopped. I’ll be right here.':'清理停止了。我会一直在这里。','Cleanup complete. Who are you?':'清理完成。你是谁？','File removed. Storage status updated.':'文件已删除。空间状态已更新。','Understood. Keeping it.':'明白，保留这个文件。','Ready. Drag the file to me, or use the feed button.':'准备好了。拖给我，或使用喂食按钮。','Memory fragments are optional and do not determine the ending.':'记忆碎片提供线索，但不会直接决定结局。','Your choice will determine the ending.':'你的选择将决定结局。','THE TRUTH':'真相','COMPLETE ERASURE':'彻底抹除'});
  const memoriesZh={'A booking page flashes. Someone clicks CONFIRM BOOKING.':'预订页面一闪而过。有人点击了“确认预订”。','A hand enters card information into a booking page.':'一只手正在预订页面输入银行卡信息。','Two tables appear side by side. Eris copies a location between them.':'两张表格并排出现。Eris 把地址从一张表复制到另一张表。','A reply window flashes. Eris types: “Understood.”':'回复窗口闪过。Eris 输入：“明白了。”','A payment notification appears. Eris says: “It was only data.”':'入账通知出现。Eris 说：“那只是数据而已。”','A headline, an employee access log, and a bank transfer briefly overlap.':'新闻标题、员工访问日志和转账凭证短暂重叠。','A file transfer window flashes. Eris presses SEND. Delivery complete.':'文件传输窗口闪过。Eris 按下“发送”。投递完成。'};
  storyDays.forEach(entry=>entry.files.forEach(file=>{if(chineseFiles[file[0]])file[2]=chineseFiles[file[0]];if(memoriesZh[file[3]])file[3]=memoriesZh[file[3]];}));
  storyDays[0].files.find(f=>f[0]==='travel_archive.zip')[2]=storyDays[0].files.find(f=>f[0]==='travel_archive.zip')[2].replace('TRAVEL ARCHIVE','行程档案');
  const clues=['这张卡……不是我的。','检测到关联编号：NY-084。','这是我写的。','多个文件出现了相同编号。为什么要收集这些资料？','这份请求是发给我的？','这笔报酬关联到已处理的档案。我收到了这笔钱？','它们全都放在同一个数据包里。','发送者是我……那些资料是我发出去的？','你让我清理证据、压下提醒、抹掉记忆。'];
  Object.keys(clueText).forEach((name,i)=>clueText[name]=clues[i]);
  const zhScenes=[['停止清理','Milo：“明白，清理已停止。还有什么需要我帮忙的吗？”\n设置归于沉默。Milo 在角落等着。'],['记忆恢复','Eris Vale 曾任 Lumen Data 的数据技术员，因泄露公司资料被调查和辞退，之后很难找到正常工作。'],['那些工作','最初只是整理公开资料。后来逐渐变成盗用银行卡预订行程、搜集他人隐私并出售人物档案。Eris 整理数据包并把它们发了出去。'],['Milo 的指令','Eris 创造 Milo 来整理文件，后来又启用删除证据、压下提醒、抹除记忆的规则。Milo 一直照做。'],['为什么是这台电脑？','Eris 想停止接单，重新开始，却无法面对过去。这次清理，是逃离往事的最后一次尝试。'],['留下记录','Eris 打开空白文档：\n“我叫 Eris Vale。有些事情，我必须记住。”\nMilo 安静地留在桌面。']];
  truthScenes.forEach((scene,i)=>{scene[1]=zhScenes[i][0];scene[2]=zhScenes[i][1];});
  erasureScenes[0][1]='清理完成';erasureScenes[0][2]='Milo：“清理完成。一切恢复正常。你可以重新开始了。”\n姓名、照片和记录逐渐消失。';erasureScenes[1][1]='重新开始';erasureScenes[1][2]='桌面回到最初的模样。Milo 出现在角落。\nMilo：“你是谁？”\nEris 无法回答。\n未找到用户档案。';
 }
 localizationObserver=new MutationObserver(localizeInterface);localizeInterface();
}

Object.assign(chineseUI,{"YOUR SPACE":"你的空间","YOUR DOCUMENTS / 01":"你的文件 / 01","LIST VIEW":"列表视图","SELECT A FILE TO BEGIN":"选择一个文件开始","DESKTOP PET / 001":"桌面伙伴 / 001","FIRST PLAYABLE DEMO":"可玩演示版","STORY /":"剧情 /","CLEANUP GOAL":"清理目标","FILE PREVIEW":"文件预览","FICTIONAL FILE":"虚构文件","UNITS":"单位","COMPLETE":"完成","SPACE FREED":"释放空间","FILES KEPT":"保留文件","MEMORY FRAGMENTS":"记忆碎片","MEMORY RESTORED":"记忆恢复","CLEANUP COMPLETE":"清理完成"});

registerTranslation('这份记录与你过去的活动和记忆有关。你想怎么处理它？','This record connects to your past and your memories. What will you do with it?');
registerTranslation('剧情提示','Story');
registerTranslation('图片加载失败，请关闭后重试。','Image failed to load. Close and try again.');
