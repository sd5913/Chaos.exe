# Story Development — From Desktop Cleanup to Psychological Horror

## 1. Initial Concept
The original concept was a desktop cleanup game featuring a virtual pet. Players would organize files, delete unnecessary data, and feed the deleted files to their pet.

As the concept developed, we decided to introduce a psychological horror narrative, turning an ordinary cleanup experience into something more unsettling.

## 2. Story Concept
The game takes place in a fictional computer belonging to the protagonist. At first, players complete simple cleanup tasks with the help of a cute and friendly virtual pet.

As the game progresses, suspicious files, photographs, and personal records begin to reveal the protagonist's involvement in a digital crime, involving the theft, misuse, and sale of other people's personal information.

The pet gradually becomes more demanding, encouraging players to delete increasingly important files. Players initially believe the pet is becoming dangerous, but eventually discover that it has been following instructions configured by the protagonist.

A hidden settings file reveals that the protagonist originally created CLEAN.exe with instructions to delete evidence, suppress reminders, and erase associated memories.

The real horror is not that the pet has become a monster, but that the protagonist is responsible for everything that happened.

## 3. Two Possible Endings
### Ending A — Complete Erasure (Bad Ending)

The player chooses to delete the remaining evidence. The protagonist eventually loses all memories and their sense of identity.

The pet returns to its original cute appearance, and the game restarts from the opening scene. When the pet asks, "Who are you?", the protagonist can no longer remember.

The cleanup process enters an endless cycle.

### Ending B — The Truth (True Ending)

The player chooses to preserve the evidence and successfully terminates the pet.

Before disappearing, the pet returns to its original appearance and says:

#### "I only did what you asked."

The player then discovers a hidden configuration file, revealing that all the deletion instructions were originally set by the protagonist.

Finally, a new file appears on the desktop:

CONFESSION.txt

The game ends with the protagonist facing the truth about their past.

## 4. Core Narrative
The game explores memory, identity, and personal responsibility.

The pet was never the real monster. The player was the one who created it.

What begins as a simple desktop cleanup game gradually becomes a psychological horror experience about escaping or confronting one's past.

## 5. Core Gameplay Design

### 5.1 Virtual Pet Guidance

The virtual pet gradually guides the player through daily gentle reminders and repeated instructions, encouraging them to accept the act of deleting files and avoiding their past.

In the early stages, the pet appears friendly and helpful, assisting the player with simple cleanup tasks. As the game progresses, it begins encouraging the player to delete increasingly important files, including personal records and evidence related to the protagonist's past.

### 5.2 File Inspection and Cleanup

To prevent players from deleting files without checking their contents, the game introduces a file inspection system. Players must open and read each file before deciding whether to feed it to the virtual pet.

During the tutorial, the pet can remind players to inspect files first to avoid feeding it infected files and making it "sick". This helps players become familiar with the file preview system while also making file contents an important part of the storytelling.

### 5.3 Daily Memory Limits and Completion Rules

The game uses a fixed **100-unit storage capacity (100%)**, of which **30 units (30%)** are occupied by the operating system. The remaining space is used by files introduced across seven days. The design includes **40 files** in total: **8 main-story files, 12 side-story files, and 20 ordinary files**.

Players inspect files, choose what to delete, and feed deleted files to Milo. A day ends only after the required amount of storage has been freed. In the early days, players have more freedom; later, numerical constraints and Milo's interventions force the deletion of evidence. The figures below are the current design specification rather than the earlier illustrative 2–3-file tutorial estimate.

## 6. Numerical and Level Design

### 6.1 Seven-Day Targets

| Day | Initial usage | Completion target | Minimum deletion | Deletion mechanic |
|---|---:|---:|---:|---|
| Day 1 | 70% | ≤65% | ≥5 units | Free deletion |
| Day 2 | 58% | ≤50% | ≥8 units | Free deletion |
| Day 3 | 58% | ≤47% | ≥11 units | Free deletion, beginning trade-offs |
| Day 4 | 57% | ≤43% | ≥14 units | Soft coercion (recommended deletion) |
| Day 5 | 57% | ≤35% | ≥22 units | First hard coercion |
| Day 6 | 57% | ≤32% | ≥25 units | Escalated coercion |
| Day 7 | 48% | ≤32% / ≤38% | ≥16 / ≥10 units | Final choice (two endings) |

All percentages are expressed against the 100-unit total capacity, so a decrease of 5 percentage points corresponds to deleting 5 units. The Day 7 requirements depend on the selected ending.

### 6.2 Deletion Pressure and Narrative Integration

- **Days 1–2 — Friendly assistance:** Milo introduces previews and storage targets. Day 1 can be completed without deleting story files, while Day 2 begins to require a more consequential choice.
- **Day 3 — Emerging trade-offs:** Ordinary files cannot satisfy the target alone. The player must begin sacrificing potentially meaningful information.
- **Day 4 — Soft coercion:** Milo repeatedly recommends deleting `client_requests.eml`, but the player can still preserve it.
- **Day 5 — First mandatory evidence deletion:** The 18 units of ordinary and side files are insufficient to meet the 22-unit target. `payment_history.png` must be deleted.
- **Day 6 — Escalation:** The 19 units of ordinary and side files are insufficient to meet the 25-unit target. `export_log.txt` must be deleted.
- **Day 7 — Final choice:** The player inspects `USER_PREFERENCES.cfg` and chooses between deleting the remaining evidence and confronting the past.

### 6.3 Day 7 Ending Conditions

**Ending A — Clean Slate / Complete Erasure:** Reach **≤32%** usage by deleting **≥16 units**. `USER_PREFERENCES.cfg` must be deleted. Milo completes the cleanup, leaving the protagonist without the memories or evidence needed to reconstruct their identity.

**Ending B — A Real Fresh Start / The Truth:** Reach **≤38%** usage by deleting **≥10 units**. The player disables Milo's automatic deletion and memory-suppression rules and preserves the important records, confronting the truth rather than erasing it.

**Implementation note:** The source numerical design lists the Day 7 thresholds and outcomes, but does not specify the exact required deletion combination for each branch. The preservation rules and interaction for disabling Milo should be finalized during implementation. The original story concept also places the discovery of the hidden configuration file after Milo's termination in Ending B, whereas the current level specification asks the player to inspect it before the final choice. The order of this reveal needs one agreed implementation.

## 7. File Content and Narrative Design

### 7.1 File Categories

- **Main (8 files):** Key evidence revealing the crime, the protagonist's involvement, and Milo's origin.
- **Side (12 files):** Context about the protagonist's personal circumstances, Milo's development, and the gradual shift in behavior.
- **Ordinary (20 files):** Everyday computer clutter that supports the cleanup premise and provides choices; a few also contain subtle narrative hints.

The following is the complete current 40-file specification. File sizes use **storage units** from the approved numerical design, not real-world MB/GB values. Each day's file sizes sum to the file storage introduced in that level.

### 7.2 Day 1 — A Fresh Start

**Narrative goal:** First Cleanup. **Storage:** 70% → ≤65%; delete ≥5 units.

**Rule:** Players can meet the target by deleting ordinary files; no story file is required.

| ID | File | Type | Size (units) | Content / narrative purpose |
|---|---|---|---:|---|
| F001 | `browser_cache_01.tmp` | Ordinary | 8 | Browser cache that can be safely deleted. |
| F002 | `duplicate_screenshots.zip` | Ordinary | 12 | A collection of duplicate screenshots. |
| F003 | `MILO_README.txt` | Side | 3 | Instructions for Milo’s original version, showing that it began as a simple file-management assistant. |
| F004 | `job_application_v3.docx` | Side | 5 | An unfinished job application belonging to the protagonist. |
| F005 | `travel_archive.zip` | Main | 12 | Flight tickets, hotel reservations, and travel orders that initially appear to be old work records. |

### 7.3 Day 2 — Old Records

**Narrative goal:** Strangers’ Personal Data. **Storage:** 58% → ≤50%; delete ≥8 units.

**Rule:** Ordinary files alone cannot meet the target; at least one side or main file must be deleted.

| ID | File | Type | Size (units) | Content / narrative purpose |
|---|---|---|---:|---|
| F006 | `holiday_wallpaper_old.png` | Ordinary | 5 | An old desktop wallpaper. |
| F007 | `dismissal_notice.eml` | Side | 4 | A dismissal notice from a technology company mentioning an internal data-leak investigation. |
| F008 | `rent_overdue.pdf` | Side | 3 | An overdue-rent notice explaining the protagonist’s financial pressure. |
| F009 | `card_NY_084.png` | Main | 9 | A photograph of a stranger’s credit card. |
| F010 | `profile_021.jpg` | Main | 7 | A personal photograph of the cardholder, making the person behind the data visible. |

### 7.4 Day 3 — Something Is Familiar

**Narrative goal:** Connections Between Records. **Storage:** 58% → ≤47%; delete ≥11 units.

**Rule:** The three ordinary files total 9 units, so at least one side or main file must be deleted.

| ID | File | Type | Size (units) | Content / narrative purpose |
|---|---|---|---:|---|
| F011 | `contacts_backup_OLD.vcf` | Ordinary | 3 | An outdated contact backup. |
| F012 | `map_cache.bin` | Ordinary | 4 | Cached data from a map application. |
| F013 | `untitled_notes_7.txt` | Ordinary | 2 | A few meaningless temporary notes. |
| F014 | `data_merge_script.py` | Side | 5 | A script written by the protagonist to match names, addresses, and photographs automatically. |
| F015 | `search_history.json` | Side | 4 | Search history containing victims’ names and addresses. |
| F016 | `address_records.csv` | Main | 10 | A database of addresses, phone numbers, and identity details matching earlier photographs and card records. |

### 7.5 Day 4 — Client Requests

**Narrative goal:** The Client. **Storage:** 57% → ≤43%; delete ≥14 units.

**Rule:** Milo repeatedly recommends client_requests.eml and dismisses its value, but the player can still keep it.

| ID | File | Type | Size (units) | Content / narrative purpose |
|---|---|---|---:|---|
| F017 | `meeting_audio_test.wav` | Ordinary | 3 | A microphone test recording containing only noise. |
| F018 | `installer_old.dmg` | Ordinary | 4 | An outdated software installer. |
| F019 | `empty_folder_index.dat` | Ordinary | 2 | An index generated for an empty folder. |
| F020 | `client_aliases.txt` | Side | 4 | Client aliases such as ORBIT_7, NIGHTTRAIN, and JUNO. |
| F021 | `unsent_reply_draft.txt` | Side | 5 | An unsent draft: “The information requested this time is too detailed.” |
| F022 | `client_requests.eml` | Main | 9 | A client email asking the protagonist to investigate, organize, and expose someone’s private information. |

### 7.6 Day 5 — Payment History

**Narrative goal:** Transaction Records. **Storage:** 57% → ≤35%; delete ≥22 units.

**Rule:** Ordinary and side files total 18 units, below the 22-unit requirement. payment_history.png is mandatory.

| ID | File | Type | Size (units) | Content / narrative purpose |
|---|---|---|---:|---|
| F023 | `receipt_scan_blurry.jpg` | Ordinary | 2 | An old receipt scan too blurry to read. |
| F024 | `crypto_price_widget.cache` | Ordinary | 3 | Cached data from a cryptocurrency price widget. |
| F025 | `game_save_backup.sav` | Ordinary | 5 | An old game save backup. |
| F026 | `invoice_2024_11.pdf` | Side | 4 | An invoice issued by the protagonist to an anonymous client for “data organization services.” |
| F027 | `bank_security_alert.eml` | Side | 4 | A bank alert about several transfers from unusual sources. |
| F028 | `payment_history.png` | Main | 9 | A complete transaction history showing that the protagonist was paid for selling personal information. |

### 7.7 Day 6 — No More Junk

**Narrative goal:** Active Involvement. **Storage:** 57% → ≤32%; delete ≥25 units.

**Rule:** Ordinary and side files total 19 units, below the 25-unit requirement. export_log.txt is mandatory.

| ID | File | Type | Size (units) | Content / narrative purpose |
|---|---|---|---:|---|
| F029 | `archive_copy_FINAL.zip` | Ordinary | 5 | A redundant archive containing duplicated material. |
| F030 | `temp_render_004.mov` | Ordinary | 4 | An unfinished video render. |
| F031 | `system_crash_2025.log` | Ordinary | 3 | A routine system crash log. |
| F032 | `untitled_spreadsheet.csv` | Ordinary | 2 | An almost empty spreadsheet. |
| F033 | `package_manifest.json` | Side | 5 | A manifest describing data-package contents: photos, addresses, payments, and travel records. |
| F034 | `export_log.txt` | Main | 8 | A log showing that the protagonist actively organized, compressed, and sent the data to buyers. |

### 7.8 Day 7 — Complete Cleanup

**Narrative goal:** Milo’s Truth. **Storage:** 48% → ≤32% / ≤38%; delete ≥16 / ≥10 units.

**Rule:** Inspect USER_PREFERENCES.cfg to discover who configured Milo, then choose complete erasure or preservation and confrontation.

| ID | File | Type | Size (units) | Content / narrative purpose |
|---|---|---|---:|---|
| F035 | `recycle_bin_index.db` | Ordinary | 2 | The recycle-bin index. |
| F036 | `desktop_layout.bak` | Ordinary | 2 | A backup of desktop icon positions. |
| F037 | `memory_cleanup.tmp` | Ordinary | 3 | A file resembling temporary system data that briefly displays an abnormal message. |
| F038 | `welcome_message.txt` | Ordinary | 1 | Milo’s original greeting: “Hello! What should I call you?” |
| F039 | `MILO_CHANGELOG.md` | Side | 4 | Version history showing that the protagonist gradually added evidence recognition and memory-reminder suppression. |
| F040 | `USER_PREFERENCES.cfg` | Main | 6 | The final configuration revealing that automatic evidence deletion, reminder suppression, and associated-memory erasure were enabled by the user. |

The final configuration file contains:

```ini
AUTO_DELETE_EVIDENCE       ENABLED
SUPPRESS_REMINDERS         ENABLED
ERASE_ASSOCIATED_MEMORIES  ENABLED

CONFIGURED_BY: USER
```

## 8. Milo's Behavioral Progression

| Stage | Behavior | Narrative function |
|---|---|---|
| Days 1–3 | Friendly assistance, reminders, and encouragement | Establish trust and normalize cleanup. |
| Day 4 | Repeated recommendations to remove a specific evidence file | Introduce doubt about Milo's intentions. |
| Day 5 | Pressure and the first mandatory evidence deletion | Demonstrate the loss of player autonomy. |
| Day 6 | Stronger intervention and persistent demands | Make Milo appear increasingly threatening. |
| Day 7 | Final confrontation with the user's own settings | Reframe Milo as the executor of the protagonist's past choices. |

The central interaction between gameplay and narrative is that deleting files both frees storage and destroys information. The player learns the truth by inspecting the same files the system pressures them to erase.

## 9. UI and Audio Development

The original UI, Pixel Pop OS, features a playful color palette dominated by cream yellow (40%), light blue (25%), and bright yellow (20%), with additional accent colors.

Starting from Day 5, the interface gradually shifts to a muted, less saturated color palette while retaining its original visual identity. This subtle change reflects the growing psychological horror atmosphere without compromising readability or usability.

Two background music tracks were implemented: Normal BGM for Days 1–4 and Horror BGM for Days 5–7, with a crossfade transition between them. Additional UI click sound effects provide audio feedback for player interactions.

CSS theme switching and JavaScript audio controls synchronize the visual and audio progression with the game's narrative.
