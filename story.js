// Seven days of fictional files. File sizes are game units, not real storage.
const storyDays = [
 {goal:5,files:[
 ['browser_cache_01.tmp',8,'BROWSER CACHE\nCached items: 126\nLast updated: 164 days ago\nStatus: Outdated'],
 ['duplicate_screenshots.zip',12,'DUPLICATE SCREENSHOTS\ndesktop_01.png\ndesktop_01_copy.png\nloading_screen.png\nloading_screen_copy.png\ncoffee_blurry.jpg'],
 ['MILO_README.txt',3,'MILO v1.0\nA small friend for a messy desktop.\n\nMilo can find duplicates, suggest cleanup and remember your preferences.\nCreated by: E. Vale'],
 ['job_application_v3.docx',5,'JOB APPLICATION\nName: Eris Vale\nPrevious employer: Lumen Data\nPosition: Data Technician\nSkills: data processing, scripting, system maintenance\nReason for leaving: __________'],
 ['travel_archive.zip',12,'TRAVEL ARCHIVE\nbooking_NY_084.pdf\nbooking_NY_091.pdf\nticket_LN_033.pdf\n\nBooking reference: NY-084\nPassenger: M. Rowe\nStatus: Confirmed','A booking page flashes. Someone clicks CONFIRM BOOKING.'] ]},
 {goal:8,files:[
 ['holiday_wallpaper_old.png',5,'An old photograph of a beach, blue water and a yellow umbrella.'],
 ['dismissal_notice.eml',4,'From: Human Resources, Lumen Data\nTo: Eris Vale\nSubject: Notice of termination\n\nFollowing an investigation into the unauthorised disclosure of company information, your employment has been terminated. Your access has been revoked.'],
 ['rent_overdue.pdf',3,'PAYMENT REMINDER\nTenant: Eris Vale\nYour rent remains unpaid.\n\nHandwritten: One more job. Then I can catch up.'],
 ['card_NY_084.png',9,'M. ROWE\n•••• •••• •••• 4812\n\nNY-084\nBooking successful','A hand enters card information into a booking page.'],
 ['profile_021.jpg',7,'A photograph of a person holding a birthday cake.\n\nPROFILE 021\nName: Morgan Rowe\nLocation: New York\nLinked record: NY-084','A photograph is dragged into a folder named PROFILES.'] ]},
 {goal:11,files:[
 ['contacts_backup_OLD.vcf',3,'CONTACT BACKUP\nEntries found: 18\nEntries without phone numbers: 11'],
 ['map_cache.bin',4,'MAP CACHE\nCached map images and location data.\nPreview unavailable.'],
 ['untitled_notes_7.txt',2,'Buy coffee.\nUpdate password.\nCall the landlord.\nRemember to eat.'],
 ['data_merge_script.py',5,'# DATA MERGE SCRIPT\n# Author: E. Vale\n# Match records. Remove duplicates. Export clean results.\n\ndef merge_records(records):\n    return match_by_identifier(records)'],
 ['search_history.json',4,'RECENT SEARCHES\nMorgan Rowe\nMorgan Rowe address\nMorgan Rowe travel\nNY-084\n\nSaved to: PROFILES'],
 ['address_records.csv',10,'PROFILE_ID,NAME,LOCATION,LINKED_RECORD,STATUS\n021,Morgan Rowe,New York,NY-084,READY\n022,Alex Chen,London,LN-033,READY\n023,Sam Taylor,New York,NY-091,READY','Two tables appear side by side. Eris copies a location between them.'] ]},
 {goal:14,files:[
 ['meeting_audio_test.wav',3,'[Audio transcript]\nStatic.\n“Testing. One, two.”'],
 ['installer_old.dmg',4,'INSTALLER\nVersion: Outdated\nThis installer is no longer supported.'],
 ['empty_folder_index.dat',2,'FOLDER INDEX\nItems found: 0\nNo content available.'],
 ['client_aliases.txt',4,'CLIENT ALIASES\nORBIT_7 — travel\nNIGHTTRAIN — profiles\nJUNO — urgent requests\n\nDo not use real names.'],
 ['unsent_reply_draft.txt',5,'DRAFT — NOT SENT\nThis request includes a home address and family members. Are you sure you need all of it?\n\nI don’t think I should do this.'],
 ['client_requests.eml',9,'From: NIGHTTRAIN\nTo: Eris Vale\nSubject: Profile request\n\nPlease prepare the profile. Include a recent photo, current address and available contact details.\n\nSame arrangement as before. Payment after delivery.','A reply window flashes. Eris types: “Understood.”'] ]},
 {goal:22,files:[
 ['receipt_scan_blurry.jpg',2,'A crumpled receipt. The only legible items are coffee, bread and batteries.'],
 ['crypto_price_widget.cache',3,'PRICE WIDGET CACHE\nLast update failed. Saved values are out of date.'],
 ['game_save_backup.sav',5,'GAME SAVE BACKUP\nLast played: 3 years ago\nProgress: 68%\nContinue from last save?'],
 ['invoice_2024_11.pdf',4,'INVOICE\nFrom: Eris Vale\nClient: NIGHTTRAIN\nService: Data organisation\nReference: PROFILE_021\nStatus: PAID'],
 ['bank_security_alert.eml',4,'From: Account Security\nTo: Eris Vale\n\nWe noticed several incoming payments from unrecognised sources. Were these expected?\n\nReply: Yes. These payments are expected.'],
 ['payment_history.png',9,'TRANSACTION HISTORY\nNIGHTTRAIN — PROFILE_021 — COMPLETE\nPAYMENT RECEIVED\n\nORBIT_7 — TRAVEL PACKAGE — COMPLETE\nPAYMENT RECEIVED','A payment notification appears. Eris says: “It was only data.”'] ]},
 {goal:25,files:[
 ['archive_copy_FINAL.zip',5,'ARCHIVE COPY\nAn identical archive already exists. Duplicate detected.'],
 ['temp_render_004.mov',4,'A black screen. A progress bar is stuck at 12%.\nRENDER INCOMPLETE.'],
 ['system_crash_2025.log',3,'SYSTEM LOG\nApplication stopped responding.\nApplication closed unexpectedly.\nSystem restarted successfully.'],
 ['untitled_spreadsheet.csv',2,'name,date,notes\n,,\n,,\n,,'],
 ['package_manifest.json',5,'PACKAGE CONTENTS\nprofiles/\naddresses/\ntravel/\npayment/\n\nStatus: ready to export'],
 ['export_log.txt',8,'EXPORT LOG\nPackage created.\nRecords merged.\nArchive prepared.\nExport completed.\n\nSent by: ERIS VALE\nDelivery status: COMPLETE','A file transfer window flashes. Eris presses SEND. Delivery complete.'] ]},
 {goal:10,files:[
 ['recycle_bin_index.db',2,'RECYCLE BIN INDEX\nProcessed file names are listed here. Original previews are unavailable.'],
 ['desktop_layout.bak',2,'DESKTOP LAYOUT BACKUP\nMILO: bottom right\nFolders: WORK, PERSONAL, ARCHIVE\nWallpaper: holiday_wallpaper_old.png'],
 ['memory_cleanup.tmp',3,'TEMPORARY SYSTEM FILE\nChecking associated data...\nASSOCIATED MEMORY UNAVAILABLE'],
 ['welcome_message.txt',1,'WELCOME MESSAGE\n\nHello!\nWhat should I call you?'],
 ['MILO_CHANGELOG.md',4,'MILO CHANGELOG\nv1.0 — File sorting and duplicate detection\nv1.4 — Custom reminder settings\nv2.1 — Automatic cleanup rules\nv2.6 — Associated reminder suppression\n\nChanges requested by: USER'],
 ['USER_PREFERENCES.cfg',6,'USER PREFERENCES\n\nAUTO_DELETE_EVIDENCE        ENABLED\nSUPPRESS_REMINDERS           ENABLED\nERASE_ASSOCIATED_MEMORIES    ENABLED\n\nCONFIGURED BY: ERIS VALE'] ]}
];
