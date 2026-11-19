// Seven days of fictional files. File sizes are game units, not real storage.
const storyDays = [
 {goal:5,files:[
 ['browser_cache_01.tmp',8,'BROWSER CACHE\nCached items: 126\nLast updated: 164 days ago\nStatus: Outdated'],
 ['duplicate_screenshots.zip',12,'DUPLICATE SCREENSHOTS\ndesktop_01.png\ndesktop_01_copy.png\nloading_screen.png\nloading_screen_copy.png\ncoffee_blurry.jpg'],
 ['MILO_README.txt',3,'MILO v1.0\nA small friend for a messy desktop.\n\nMilo can find duplicates, suggest cleanup and remember your preferences.\nCreated by: E. Vale'],
 ['job_application_v3.docx',5,'JOB APPLICATION\nName: Eris Vale\nPrevious employer: Lumen Data\nPosition: Data Technician\nSkills: data processing, scripting, system maintenance\nReason for leaving: __________'],
 ['travel_archive.zip',12,'TRAVEL ARCHIVE\nhotel_order_san_francisco.png\nflight_ticket_chicago_boston.png\nflight_ticket_new_york_san_francisco.png\ntaxi_receipt_boston.png\ntaxi_receipt_san_francisco.png','A booking page flashes. Someone clicks CONFIRM BOOKING.'] ]},
 {goal:8,files:[
 ['dismissal_notice.pdf',4,'NOTICE OF TERMINATION\nLumen Data — Human Resources\nEmployee: Eris Vale\n\nFollowing an investigation into the unauthorised disclosure of company information, your employment has been terminated. Your access has been revoked.'],
 ['company_rules_signed.pdf',4,'COMPANY RULES / SIGNED COPY\nLumen Data\nInternal operating procedures and company regulations.'],
 ['rent_overdue.png',3,'PAYMENT REMINDER\nTenant: Eris Vale\nYour rent remains unpaid.\n\nHandwritten: One more job. Then I can catch up.'],
 ['card_NY_084.png',9,'M. ROWE\n•••• •••• •••• 4812\n\nNY-084\nBooking successful','A hand enters card information into a booking page.'] ]},
 {goal:11,files:[
 ['contacts_backup_OLD.vcf',3,'CONTACT BACKUP\nEntries found: 18\nEntries without phone numbers: 11'],
 ['map_cache.bin',4,'MAP CACHE\nCached map images and location data.\nPreview unavailable.'],
 ['untitled_notes_7.txt',2,'Buy coffee.\nUpdate password.\nCall the landlord.\nRemember to eat.'],
 ['data_merge_script.py',5,'# DATA MERGE SCRIPT\n# Author: E. Vale\n# Match records. Remove duplicates. Export clean results.\n\ndef merge_records(records):\n    return match_by_identifier(records)'],
 ['search_history.json',4,'RECENT SEARCHES\nMorgan Rowe\nMorgan Rowe address\nMorgan Rowe travel\nNY-084\n\nSaved to: PROFILES'],
 ['address_records.png',10,'IDENTITY & ACCOUNT REGISTER\nPrepared by: E. Vale\nNames, addresses, account references and linked photographs.','Two tables appear side by side. Eris copies a location between them.'] ]},
 {goal:14,files:[
 ['meeting_audio_test.wav',3,'[Audio transcript]\nStatic.\n“Testing. One, two.”'],
 ['installer_old.dmg',4,'INSTALLER\nVersion: Outdated\nThis installer is no longer supported.'],
 ['empty_folder_index.dat',2,'FOLDER INDEX\nItems found: 0\nNo content available.'],
 ['client_aliases.txt',4,'CLIENT ALIASES\nORBIT_7 — travel\nNIGHTTRAIN — profiles\nJUNO — urgent requests\n\nDo not use real names.'],
 ['unsent_reply_draft.txt',5,'DRAFT — NOT SENT\nThis request includes a home address and family members. Are you sure you need all of it?\n\nI don’t think I should do this.'],
 ['client_requests.pdf',9,'CLIENT REQUEST / NIGHTTRAIN\nProfile request and delivery instructions.','A reply window flashes. Eris types: “Understood.”'] ]},
 {goal:22,files:[
 ['crypto_price_widget.cache',3,'PRICE WIDGET CACHE\nLast update failed. Saved values are out of date.'],
 ['game_save_backup.sav',5,'GAME SAVE BACKUP\nLast played: 3 years ago\nProgress: 68%\nContinue from last save?'],
 ['cybercrime_news_report.pdf',4,'THE CITY REGISTER / 04 DECEMBER 2008\nData leaks and card fraud prompt police inquiry.\nPolice suspect a link to a former technology-company employee with access to customer data.','A headline, an employee access log, and a bank transfer briefly overlap.'],
 ['bank_security_alert.eml',4,'From: Account Security\nTo: Eris Vale\n\nWe noticed several incoming payments from unrecognised sources. Were these expected?\n\nReply: Yes. These payments are expected.'],
 ['payment_01_20081124.png',3,'INCOMING TRANSFER / 24 NOV 2008\nORBIT_7 → ERIS VALE\n$720.00 / Batch 01 / 6 profiles × $120','A payment notification appears. Eris says: “It was only data.”'],
 ['payment_02_20081127.png',3,'INCOMING TRANSFER / 27 NOV 2008\nORBIT_7 → ERIS VALE\n$1,440.00 / Batch 02 / 12 profiles × $120'],
 ['payment_03_20081202.png',3,'INCOMING TRANSFER / 02 DEC 2008\nORBIT_7 → ERIS VALE\n$960.00 / Batch 03 / 8 profiles × $120'] ]},
 {goal:19,files:[
 ['archive_copy_FINAL.zip',5,'ARCHIVE COPY\nAn identical archive already exists. Duplicate detected.'],
 ['temp_render_004.mov',4,'A black screen. A progress bar is stuck at 12%.\nRENDER INCOMPLETE.'],
 ['system_crash_2025.log',3,'SYSTEM LOG\nApplication stopped responding.\nApplication closed unexpectedly.\nSystem restarted successfully.'],
 ['untitled_spreadsheet.csv',2,'name,date,notes\n,,\n,,\n,,'],
 ['package_manifest.json',5,'PACKAGE CONTENTS\nprofiles/\naddresses/\ntravel/\npayment/\n\nStatus: ready to export'],
 ['export_log.txt',8,'EXPORT LOG\nPackage created.\nRecords merged.\nArchive prepared.\nExport completed.\n\nSent by: ERIS VALE\nDelivery status: COMPLETE','A file transfer window flashes. Eris presses SEND. Delivery complete.'] ]},
 {goal:10,files:[
 ['recycle_bin_index.db',2,'RECYCLE BIN INDEX\nProcessed file names are listed here. Original previews are unavailable.'],
 ['desktop_layout.bak',2,'DESKTOP LAYOUT BACKUP\nMILO: bottom right\nFolders: WORK, PERSONAL, ARCHIVE\nWallpaper: holiday_wallpaper_old.png'],
 ['memory_cleanup.tmp',3,'TEMPORARY SYSTEM FILE\nChecking associated data...\nMEMORY INDEX CONNECTED / NO ERASURE EXECUTED'],
 ['welcome_message.txt',1,'WELCOME MESSAGE\n\nHello!\nWhat should I call you?'],
 ['MILO_CHANGELOG.md',4,'MILO CHANGELOG\nv1.0 — File sorting and duplicate detection\nv1.4 — Custom reminder settings\nv2.1 — Automatic cleanup rules\nv2.6 — Associated reminder suppression\n\nChanges requested by: USER'],
 ['USER_PREFERENCES.cfg',6,'USER PREFERENCES\n\nMEMORY INDEX / FINAL CONTROL FILE\n\nDeleting ordinary files does not change your memory.\nDeleting THIS file confirms and executes ERASE_ASSOCIATED_MEMORIES.\nThis action cannot be undone.\nKeeping THIS file leaves your memory intact.\n\nCONFIGURED BY: ERIS VALE'] ]}
];
