/**
 * Tarteel-inspired Quran App — Full Feature JavaScript
 * Indie features: Juz nav, Tajweed, Memorize mode, Voice search,
 * Notes, Bookmarks, Streak tracking, Daily goals, Loop/repeat, Speed control
 */

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════
const API   = 'https://api.alquran.cloud/v1';
const AUDIO = 'https://everyayah.com/data';

const JUZ_COLORS = [
  '#6366f1','#8b5cf6','#a855f7','#ec4899','#f43f5e',
  '#ef4444','#f97316','#f59e0b','#eab308','#84cc16',
  '#22c55e','#10b981','#14b8a6','#06b6d4','#0ea5e9',
  '#3b82f6','#6366f1','#8b5cf6','#a855f7','#ec4899',
  '#f43f5e','#ef4444','#f97316','#f59e0b','#84cc16',
  '#22c55e','#10b981','#14b8a6','#0ea5e9','#3b82f6',
];

// Juz 1-30 start positions [surah, ayah]
const JUZ_START = [
  [1,1],[2,142],[2,253],[3,93],[4,24],
  [4,148],[5,82],[6,111],[7,88],[8,41],
  [9,93],[11,6],[12,53],[15,1],[17,1],
  [18,75],[21,1],[23,1],[25,21],[27,56],
  [29,46],[33,31],[36,28],[39,32],[41,47],
  [46,1],[51,31],[58,1],[67,1],[78,1],
];

// Arabic names
const AR_NAMES = {
  1:'الفاتحة',2:'البقرة',3:'آل عمران',4:'النساء',5:'المائدة',
  6:'الأنعام',7:'الأعراف',8:'الأنفال',9:'التوبة',10:'يونس',
  11:'هود',12:'يوسف',13:'الرعد',14:'إبراهيم',15:'الحجر',
  16:'النحل',17:'الإسراء',18:'الكهف',19:'مريم',20:'طه',
  21:'الأنبياء',22:'الحج',23:'المؤمنون',24:'النور',25:'الفرقان',
  26:'الشعراء',27:'النمل',28:'القصص',29:'العنكبوت',30:'الروم',
  31:'لقمان',32:'السجدة',33:'الأحزاب',34:'سبأ',35:'فاطر',
  36:'يس',37:'الصافات',38:'ص',39:'الزمر',40:'غافر',
  41:'فصلت',42:'الشورى',43:'الزخرف',44:'الدخان',45:'الجاثية',
  46:'الأحقاف',47:'محمد',48:'الفتح',49:'الحجرات',50:'ق',
  51:'الذاريات',52:'الطور',53:'النجم',54:'القمر',55:'الرحمن',
  56:'الواقعة',57:'الحديد',58:'المجادلة',59:'الحشر',60:'الممتحنة',
  61:'الصف',62:'الجمعة',63:'المنافقون',64:'التغابن',65:'الطلاق',
  66:'التحريم',67:'الملك',68:'القلم',69:'الحاقة',70:'المعارج',
  71:'نوح',72:'الجن',73:'المزمل',74:'المدثر',75:'القيامة',
  76:'الإنسان',77:'المرسلات',78:'النبأ',79:'النازعات',80:'عبس',
  81:'التكوير',82:'الانفطار',83:'المطففين',84:'الانشقاق',85:'البروج',
  86:'الطارق',87:'الأعلى',88:'الغاشية',89:'الفجر',90:'البلد',
  91:'الشمس',92:'الليل',93:'الضحى',94:'الشرح',95:'التين',
  96:'العلق',97:'القدر',98:'البينة',99:'الزلزلة',100:'العاديات',
  101:'القارعة',102:'التكاثر',103:'العصر',104:'الهمزة',105:'الفيل',
  106:'قريش',107:'الماعون',108:'الكوثر',109:'الكافرون',110:'النصر',
  111:'المسد',112:'الإخلاص',113:'الفلق',114:'الناس',
};

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let allSurahs       = [];
let currentSurah    = null;
let currentAyahIdx  = -1;
let isPlaying       = false;
let loopMode        = false;
let repeatCount     = 1;
let repeatLeft      = 1;
let autoPlay        = false;
let showTranslation = true;
let showTranslit    = false;
let showTajweed     = true;
let currentMode     = 'read';   // read | memorize | listen
let currentScript   = 'indopak';
let currentTranslation = 'en.sahih';
let currentReciter  = 'Alafasy_128kbps';
let arabicFontSize  = 28;
let dailyGoal       = 10;
let notesActiveIdx  = -1;

// Persistent state
let bookmarks  = JSON.parse(localStorage.getItem('q_bookmarks') || '[]');
let notes      = JSON.parse(localStorage.getItem('q_notes') || '{}');
let stats      = JSON.parse(localStorage.getItem('q_stats') || JSON.stringify({
  streak: 0, lastDate: '', totalVerses: 0, versesToday: 0, surahsDone: [],
}));

// ═══════════════════════════════════════════════════════════
// DOM REFS
// ═══════════════════════════════════════════════════════════
const $  = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const sidebar        = $('sidebar');
const overlay        = $('overlay');
const menuBtn        = $('menu-btn');
const sidebarClose   = $('sidebar-close');
const surahList      = $('surah-list');
const surahSearch    = $('surah-search');
const juzGrid        = $('juz-grid');
const topbarTitle    = $('topbar-title');
const topbarSub      = $('topbar-sub');
const splash         = $('splash');
const loadingEl      = $('loading');
const surahContent   = $('surah-content');
const verseListEl    = $('verse-list');
const verseSearchBar = $('verse-search-bar');
const verseSearchIn  = $('verse-search');
const bismillahEl    = $('bismillah');
const goalFill       = $('goal-fill');
const goalStatus     = $('goal-status');
const audio          = $('audio');
const btnPlay        = $('btn-play');
const btnPrev        = $('btn-prev');
const btnNext        = $('btn-next');
const btnLoop        = $('btn-loop');
const progressTrack  = $('progress-track');
const progressFill   = $('progress-fill');
const progressDot    = $('progress-dot');
const timeCur        = $('time-cur');
const timeDur        = $('time-dur');
const volSlider      = $('volume');
const speedSelect    = $('speed-select');
const piSurah        = $('pi-surah');
const piAyah         = $('pi-ayah');
const settingsDrawer = $('settings-drawer');
const bookmarksDrawer= $('bookmarks-drawer');
const drawerBackdrop = $('drawer-backdrop');
const bookmarkList   = $('bookmark-list');
const noBookmarks    = $('no-bookmarks');
const notesOverlay   = $('notes-overlay');
const voiceOverlay   = $('voice-overlay');
const voiceOrb       = $('voice-orb');
const voiceStatus    = $('voice-status');
const voiceResult    = $('voice-result');
const voiceStart     = $('voice-start');
const toast          = $('toast');

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
async function init() {
  checkStreak();
  initSidebar();
  initModeTabs();
  initSidebarTabs();
  initAudio();
  initSettings();
  initBookmarksDrawer();
  initNotesModal();
  initVoiceModal();
  initVerseSearch();
  buildJuzGrid();
  buildQuickPages();
  updateStatsUI();
  updateGoalUI();
  restoreLastPosition();
  await loadSurahList();
}

// ═══════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════
function initSidebar() {
  if (window.innerWidth < 769) document.body.classList.add('sb-hidden');

  menuBtn.addEventListener('click', () => {
    if (window.innerWidth < 769) {
      document.body.classList.toggle('sb-open');
    } else {
      document.body.classList.toggle('sb-hidden');
    }
  });

  sidebarClose.addEventListener('click', () => {
    document.body.classList.remove('sb-open');
    if (window.innerWidth >= 769) document.body.classList.add('sb-hidden');
  });

  overlay.addEventListener('click', () => document.body.classList.remove('sb-open'));
}

function initSidebarTabs() {
  $$('.stab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.stab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      $$('.sidebar-panel').forEach(p => p.classList.add('hidden'));
      $(`panel-${tab.dataset.tab}`).classList.remove('hidden');
    });
  });
}

// ═══════════════════════════════════════════════════════════
// SURAH LIST
// ═══════════════════════════════════════════════════════════
async function loadSurahList() {
  try {
    const res  = await fetch(`${API}/surah`);
    const json = await res.json();
    allSurahs  = json.data;
    renderSurahList(allSurahs);
  } catch {
    surahList.innerHTML = '<li style="padding:16px;color:var(--text-muted)">Failed to load. Check connection.</li>';
  }
}

function renderSurahList(surahs) {
  surahList.innerHTML = surahs.map(s => `
    <li class="surah-item" data-num="${s.number}" data-name="${s.englishName.toLowerCase()}" onclick="selectSurah(${s.number})">
      <span class="si-num">${s.number}</span>
      <div class="si-info">
        <div class="si-en">${s.englishName} <span style="color:var(--text-subtle);font-weight:400">${s.englishNameTranslation}</span></div>
        <div class="si-meta">
          <span>${s.numberOfAyahs} verses</span>
          <span class="badge-${s.revelationType === 'Meccan' ? 'meccan' : 'medinan'}">${s.revelationType}</span>
        </div>
      </div>
      <span class="si-ar">${AR_NAMES[s.number] || s.name}</span>
    </li>
  `).join('');

  surahSearch.addEventListener('input', () => {
    const q = surahSearch.value.toLowerCase();
    $$('.surah-item').forEach(el => {
      el.style.display = (el.dataset.name.includes(q) || el.dataset.num.includes(q)) ? '' : 'none';
    });
  });
}

// ═══════════════════════════════════════════════════════════
// JUZ GRID
// ═══════════════════════════════════════════════════════════
function buildJuzGrid() {
  juzGrid.innerHTML = Array.from({length: 30}, (_, i) => {
    const n  = i + 1;
    const [s, a] = JUZ_START[i];
    return `
      <div class="juz-card" style="background:${JUZ_COLORS[i]}" onclick="selectJuz(${n})" title="Starts at Surah ${s} Ayah ${a}">
        ${n}
        <div class="juz-label">Juz ${n}</div>
      </div>
    `;
  }).join('');
}

window.selectJuz = async function(juzNum) {
  const [surahNum, ayahNum] = JUZ_START[juzNum - 1];
  await selectSurah(surahNum, ayahNum);
  // Close sidebar on mobile
  if (window.innerWidth < 769) document.body.classList.remove('sb-open');
};

// ═══════════════════════════════════════════════════════════
// PAGE NAVIGATION
// ═══════════════════════════════════════════════════════════
function buildQuickPages() {
  const pages = [1, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 604];
  $('quick-pages-grid').innerHTML = pages.map(p =>
    `<button class="qp-btn" onclick="goToPage(${p})">${p}</button>`
  ).join('');

  $('page-go').addEventListener('click', () => {
    const p = parseInt($('page-input').value);
    if (p >= 1 && p <= 604) goToPage(p);
  });
  $('page-input').addEventListener('keydown', e => { if (e.key === 'Enter') $('page-go').click(); });
}

window.goToPage = async function(page) {
  // Use alquran.cloud page endpoint
  try {
    showLoading();
    const res  = await fetch(`${API}/page/${page}/quran-simple`);
    const json = await res.json();
    if (json.data && json.data.ayahs && json.data.ayahs.length > 0) {
      const firstAyah = json.data.ayahs[0];
      await selectSurah(firstAyah.surah.number);
    }
  } catch { hideLoading(); }
  if (window.innerWidth < 769) document.body.classList.remove('sb-open');
};

// ═══════════════════════════════════════════════════════════
// LOAD SURAH
// ═══════════════════════════════════════════════════════════
window.selectSurah = async function(number, startAyah = null) {
  $$('.surah-item').forEach(el => el.classList.toggle('active', el.dataset.num == number));
  showLoading();
  stopAudio();
  currentAyahIdx = -1;

  try {
    const edition = currentTranslation;
    const [arabicRes, transRes, translitRes] = await Promise.all([
      fetch(`${API}/surah/${number}/quran-simple`),
      fetch(`${API}/surah/${number}/${edition}`),
      fetch(`${API}/surah/${number}/en.transliteration`),
    ]);
    const [arabicJson, transJson, translitJson] = await Promise.all([
      arabicRes.json(), transRes.json(), translitRes.json(),
    ]);

    const surahInfo = allSurahs.find(s => s.number === number) || {};
    const ayahs = arabicJson.data.ayahs.map((a, i) => ({
      number:      a.numberInSurah,
      globalNum:   a.number,
      arabic:      a.text,       // clean Arabic text
      translation: transJson.data.ayahs[i]?.text || '',
      translit:    translitJson.data.ayahs[i]?.text || '',
      page:        a.page,
      juz:         a.juz,
    }));

    currentSurah = {
      number,
      name:     surahInfo.englishName || `Surah ${number}`,
      nameAr:   AR_NAMES[number] || surahInfo.name,
      nameTr:   surahInfo.englishNameTranslation || '',
      type:     surahInfo.revelationType || '',
      ayahs,
    };

    localStorage.setItem('q_lastSurah', number);

    topbarTitle.textContent = `${number}. ${currentSurah.name}`;
    topbarSub.textContent   = `${currentSurah.nameAr} · ${ayahs.length} verses`;

    hideLoading();
    renderSurahPage();

    if (startAyah !== null) {
      const idx = ayahs.findIndex(a => a.number >= startAyah);
      if (idx >= 0) {
        setTimeout(() => {
          const card = document.getElementById(`verse-${idx}`);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
      }
    }
  } catch (e) {
    console.error(e);
    hideLoading();
    verseListEl.innerHTML = `<li style="padding:24px;color:var(--text-muted)">Failed to load Surah ${number}. Please try again.</li>`;
  }
};

function showLoading() {
  splash.classList.add('hidden');
  surahContent.classList.add('hidden');
  loadingEl.classList.remove('hidden');
}
function hideLoading() {
  loadingEl.classList.add('hidden');
  surahContent.classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════
// RENDER SURAH PAGE
// ═══════════════════════════════════════════════════════════
function renderSurahPage(filter = '') {
  if (!currentSurah) return;

  // Hero
  $('hero-num').textContent = currentSurah.number;
  $('hero-ar').textContent  = currentSurah.nameAr;
  $('hero-en').textContent  = currentSurah.name;
  $('hero-meta').textContent = `${currentSurah.ayahs.length} verses · ${currentSurah.type}`;
  $('hero-badges').innerHTML = `
    <span class="hero-badge">${currentSurah.type}</span>
    <span class="hero-badge">Juz ${currentSurah.ayahs[0]?.juz || '?'}</span>
    <span class="hero-badge">Page ${currentSurah.ayahs[0]?.page || '?'}</span>
  `;

  // Bismillah (not for Al-Fatiha or At-Tawbah)
  const hasBismillah = currentSurah.number !== 1 && currentSurah.number !== 9;
  bismillahEl.classList.toggle('hidden', !hasBismillah);

  // Render verses
  verseListEl.innerHTML = currentSurah.ayahs.map((ayah, i) => buildVerseCard(ayah, i, filter)).join('');

  applyFontSize();
  updateGoalUI();
}

function buildVerseCard(ayah, i, filter = '') {
  const key        = `${currentSurah.number}:${ayah.number}`;
  const isBookmarked = bookmarks.some(b => b.key === key);
  const hasNote    = !!notes[key];
  const hide       = filter && !ayah.arabic.includes(filter) && !ayah.translation.toLowerCase().includes(filter.toLowerCase()) && !String(ayah.number).includes(filter);
  const translClass = showTranslation ? '' : ' hidden';
  const translitClass = showTranslit ? '' : ' hidden';
  const arabicClass = showTajweed ? '' : '';  // tajweed via body class

  return `
    <li class="verse-card${hide ? ' hidden-card' : ''}${isBookmarked ? ' bookmarked' : ''}${hasNote ? ' has-note' : ''}"
        id="verse-${i}" data-idx="${i}" onclick="handleCardClick(${i}, event)">
      <div class="verse-card-head">
        <span class="verse-num" title="Verse ${ayah.number} · Page ${ayah.page} · Juz ${ayah.juz}">${ayah.number}</span>
        <div class="verse-actions">
          <button class="vact${isBookmarked ? ' bookmarked' : ''}" title="${isBookmarked ? 'Remove bookmark' : 'Bookmark'}"
                  onclick="toggleBookmark(event,${i})">🔖</button>
          <button class="vact" title="Note" onclick="openNote(event,${i})">📝</button>
          <button class="vact" title="Share / Copy" onclick="shareVerse(event,${i})">📤</button>
          <button class="vact" title="Play" onclick="playAyah(${i});event.stopPropagation()">▶</button>
        </div>
      </div>
      <div class="verse-arabic-wrap" onclick="revealMemorize(event,${i})">
        <div class="verse-arabic" style="font-size:${arabicFontSize}px">${ayah.arabic}</div>
      </div>
      <div class="verse-translation${translClass}">${ayah.translation}</div>
      <div class="verse-translit${translitClass}">${ayah.translit}</div>
    </li>
  `;
}

// Memorize mode — click to reveal
window.revealMemorize = function(e, idx) {
  if (currentMode !== 'memorize') return;
  e.stopPropagation();
  document.getElementById(`verse-${idx}`)?.classList.toggle('revealed');
};

window.handleCardClick = function(idx, e) {
  if (currentMode === 'memorize') return; // handled by revealMemorize
  if (e.target.closest('.verse-actions')) return;
  playAyah(idx);
};

// ═══════════════════════════════════════════════════════════
// AUDIO ENGINE
// ═══════════════════════════════════════════════════════════
function initAudio() {
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || audio.duration === Infinity) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${pct}%`;
    progressDot.style.left   = `${pct}%`;
    timeCur.textContent = fmt(audio.currentTime);
    timeDur.textContent = fmt(audio.duration);
  });

  audio.addEventListener('play',  () => { isPlaying = true;  btnPlay.textContent = '⏸'; });
  audio.addEventListener('pause', () => { isPlaying = false; btnPlay.textContent = '▶'; });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    btnPlay.textContent = '▶';
    if (loopMode || repeatLeft > 1) {
      if (repeatLeft > 1) repeatLeft--;
      audio.play();
      return;
    }
    repeatLeft = repeatCount;
    if (autoPlay) advanceAyah(1);
  });

  audio.addEventListener('error', () => {
    console.warn('Audio error:', audio.src);
    btnPlay.textContent = '▶';
  });

  // Progress click
  progressTrack.addEventListener('click', e => {
    if (!audio.duration) return;
    const r   = progressTrack.getBoundingClientRect();
    const pct = (e.clientX - r.left) / r.width;
    audio.currentTime = pct * audio.duration;
  });

  btnPlay.addEventListener('click', () => {
    if (currentAyahIdx < 0 && currentSurah) { playAyah(0); return; }
    isPlaying ? audio.pause() : audio.play().catch(console.warn);
  });

  btnPrev.addEventListener('click', () => advanceAyah(-1));
  btnNext.addEventListener('click', () => advanceAyah(1));

  btnLoop.addEventListener('click', () => {
    loopMode = !loopMode;
    btnLoop.classList.toggle('active', loopMode);
    showToast(loopMode ? 'Loop ON 🔁' : 'Loop OFF');
  });

  volSlider.addEventListener('input', () => { audio.volume = parseFloat(volSlider.value); });
  speedSelect.addEventListener('change', () => { audio.playbackRate = parseFloat(speedSelect.value); });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.code === 'Space') { e.preventDefault(); btnPlay.click(); }
    if (e.code === 'ArrowRight' && !e.shiftKey) advanceAyah(1);
    if (e.code === 'ArrowLeft'  && !e.shiftKey) advanceAyah(-1);
    if (e.code === 'KeyL') btnLoop.click();
    if (e.code === 'KeyM') toggleMode('memorize');
  });
}

window.playAyah = function(idx) {
  if (!currentSurah || idx < 0 || idx >= currentSurah.ayahs.length) return;

  // Deactivate previous
  if (currentAyahIdx >= 0) {
    document.getElementById(`verse-${currentAyahIdx}`)?.classList.remove('playing');
  }

  currentAyahIdx = idx;
  repeatLeft     = repeatCount;
  const ayah     = currentSurah.ayahs[idx];
  const sp = String(currentSurah.number).padStart(3, '0');
  const ap = String(ayah.number).padStart(3, '0');

  audio.src         = `${AUDIO}/${currentReciter}/${sp}${ap}.mp3`;
  audio.playbackRate = parseFloat(speedSelect.value);
  audio.load();
  audio.play().catch(console.warn);

  const card = document.getElementById(`verse-${idx}`);
  card?.classList.add('playing');
  card?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  piSurah.textContent = `${currentSurah.name}`;
  piAyah.textContent  = `Verse ${ayah.number} · Juz ${ayah.juz} · Page ${ayah.page}`;
  $('player-thumb').textContent = AR_NAMES[currentSurah.number]?.[0] || '☽';

  progressFill.style.width = '0%';
  progressDot.style.left   = '0%';
  timeCur.textContent = '0:00';
  timeDur.textContent = '0:00';

  localStorage.setItem('q_lastSurah', currentSurah.number);
  localStorage.setItem('q_lastAyah',  idx);

  // Stats tracking
  incrementVersesRead();
};

function advanceAyah(delta) {
  if (!currentSurah) return;
  const next = currentAyahIdx + delta;
  if (next >= 0 && next < currentSurah.ayahs.length) {
    playAyah(next);
  } else if (delta > 0) {
    showToast('End of Surah');
    // Mark surah as completed
    if (!stats.surahsDone.includes(currentSurah.number)) {
      stats.surahsDone.push(currentSurah.number);
      saveStats();
      updateStatsUI();
    }
  }
}

function stopAudio() {
  audio.pause();
  audio.src = '';
  isPlaying  = false;
  btnPlay.textContent = '▶';
  progressFill.style.width = '0%';
  progressDot.style.left   = '0%';
  timeCur.textContent = '0:00';
  timeDur.textContent = '0:00';
  piSurah.textContent = '—';
  piAyah.textContent  = 'Select a verse to play';
}

function fmt(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ═══════════════════════════════════════════════════════════
// MODE TABS (Read / Memorize / Listen)
// ═══════════════════════════════════════════════════════════
function initModeTabs() {
  $$('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleMode(btn.dataset.mode));
  });

  $('translation-select').addEventListener('change', e => {
    currentTranslation = e.target.value;
    if (currentSurah) reloadTranslation();
  });

  $('reciter-select').addEventListener('change', e => {
    currentReciter = e.target.value;
    if (currentAyahIdx >= 0 && isPlaying) playAyah(currentAyahIdx);
  });
}

function toggleMode(mode) {
  currentMode = mode;
  $$('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.body.className = document.body.className
    .replace(/mode-\w+/g, '')
    .trim();
  document.body.classList.add(`mode-${mode}`);

  if (mode === 'memorize') {
    $$('.verse-card').forEach(c => c.classList.remove('revealed'));
    showToast('Memorize mode — tap Arabic to reveal 🧠');
  } else if (mode === 'listen') {
    showToast('Listen mode — press ▶ to play through 🎧');
    if (currentAyahIdx < 0 && currentSurah) {
      autoPlay = true;
      $('toggle-autoplay').checked = true;
      playAyah(0);
    }
  }
}

async function reloadTranslation() {
  if (!currentSurah) return;
  try {
    const res  = await fetch(`${API}/surah/${currentSurah.number}/${currentTranslation}`);
    const json = await res.json();
    json.data.ayahs.forEach((a, i) => {
      if (currentSurah.ayahs[i]) currentSurah.ayahs[i].translation = a.text;
    });
    renderSurahPage(verseSearchIn.value);
  } catch { console.warn('Failed to reload translation'); }
}

// ═══════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════
function initSettings() {
  // Open/Close settings
  $('btn-settings').addEventListener('click', () => openDrawer('settings-drawer'));
  $('btn-bookmarks').addEventListener('click', () => openDrawer('bookmarks-drawer'));
  $('btn-search-toggle').addEventListener('click', () => {
    verseSearchBar.classList.toggle('hidden');
    $('btn-search-toggle').classList.toggle('active', !verseSearchBar.classList.contains('hidden'));
    if (!verseSearchBar.classList.contains('hidden')) verseSearchIn.focus();
  });
  $('btn-voice').addEventListener('click', () => openModal('voice-overlay'));

  $$('.drawer-close').forEach(btn => {
    btn.addEventListener('click', () => closeDrawer(btn.dataset.close));
  });
  drawerBackdrop.addEventListener('click', () => {
    closeDrawer('settings-drawer'); closeDrawer('bookmarks-drawer');
  });

  // Script toggle
  $$('input[name="script"]').forEach(radio => {
    radio.addEventListener('change', () => {
      currentScript = radio.value;
      $$('.radio-opt').forEach(o => o.classList.remove('active'));
      radio.parentElement.classList.add('active');
      document.body.classList.toggle('script-uthmani', currentScript === 'uthmani');
      document.body.classList.toggle('tajweed-on', currentScript !== 'uthmani' && showTajweed);
    });
  });

  // Tajweed toggle
  $('toggle-tajweed').addEventListener('change', e => {
    showTajweed = e.target.checked;
    document.body.classList.toggle('tajweed-on', showTajweed && currentScript === 'indopak');
  });
  document.body.classList.add('tajweed-on'); // default on

  // Translation toggle
  $('toggle-translation').addEventListener('change', e => {
    showTranslation = e.target.checked;
    $$('.verse-translation').forEach(el => el.classList.toggle('hidden', !showTranslation));
  });

  // Translit toggle
  $('toggle-translit').addEventListener('change', e => {
    showTranslit = e.target.checked;
    $$('.verse-translit').forEach(el => el.classList.toggle('hidden', !showTranslit));
  });

  // Auto-play toggle
  $('toggle-autoplay').addEventListener('change', e => { autoPlay = e.target.checked; });

  // Font size
  const fsSlider = $('font-size');
  const fsVal    = $('font-size-val');
  fsSlider.addEventListener('input', () => {
    arabicFontSize = parseInt(fsSlider.value);
    fsVal.textContent = arabicFontSize;
    applyFontSize();
  });

  // Daily goal
  $('daily-goal-input').addEventListener('change', e => {
    dailyGoal = Math.max(1, parseInt(e.target.value) || 10);
    $('stat-goal').textContent = dailyGoal;
    updateGoalUI();
  });

  // Repeat count
  $('repeat-count').addEventListener('change', e => {
    repeatCount = parseInt(e.target.value);
    repeatLeft  = repeatCount;
  });

  // Reset stats
  $('reset-stats').addEventListener('click', () => {
    if (!confirm('Reset all stats? This cannot be undone.')) return;
    stats = { streak: 0, lastDate: '', totalVerses: 0, versesToday: 0, surahsDone: [] };
    saveStats(); updateStatsUI(); updateGoalUI();
    showToast('Stats reset ✅');
  });
}

function openDrawer(id) {
  $(id).classList.remove('hidden');
  drawerBackdrop.classList.remove('hidden');
  if (id === 'bookmarks-drawer') renderBookmarks();
  if (id === 'settings-drawer') syncStatsToDrawer();
}
function closeDrawer(id) {
  $(id)?.classList.add('hidden');
  if (!$$('.drawer:not(.hidden)').length) drawerBackdrop.classList.add('hidden');
}
function openModal(id) { $(id)?.classList.remove('hidden'); }
function closeModal(id) { $(id)?.classList.add('hidden'); }

function applyFontSize() {
  $$('.verse-arabic').forEach(el => el.style.fontSize = `${arabicFontSize}px`);
}

// ═══════════════════════════════════════════════════════════
// BOOKMARKS
// ═══════════════════════════════════════════════════════════
function initBookmarksDrawer() {
  // nothing extra needed; handled via openDrawer
}

window.toggleBookmark = function(e, idx) {
  e.stopPropagation();
  if (!currentSurah) return;
  const ayah = currentSurah.ayahs[idx];
  const key  = `${currentSurah.number}:${ayah.number}`;
  const existing = bookmarks.findIndex(b => b.key === key);
  const card = document.getElementById(`verse-${idx}`);
  const btn  = card?.querySelector('.vact');

  if (existing > -1) {
    bookmarks.splice(existing, 1);
    card?.classList.remove('bookmarked');
    btn?.classList.remove('bookmarked');
    showToast('Bookmark removed');
  } else {
    bookmarks.push({ key, surah: currentSurah.number, ayah: ayah.number,
      surahName: currentSurah.name, translation: ayah.translation.slice(0, 100) });
    card?.classList.add('bookmarked');
    btn?.classList.add('bookmarked');
    showToast('Bookmarked! 🔖');
  }
  localStorage.setItem('q_bookmarks', JSON.stringify(bookmarks));
};

function renderBookmarks() {
  if (!bookmarks.length) {
    bookmarkList.innerHTML = '';
    noBookmarks.classList.remove('hidden');
    return;
  }
  noBookmarks.classList.add('hidden');
  bookmarkList.innerHTML = bookmarks.map((b, i) => `
    <li class="bmark-item" onclick="jumpToBookmark('${b.key}')">
      <div class="bmark-text">
        <div class="bmark-title">${b.surahName} · ${b.ayah}</div>
        <div class="bmark-preview">${b.translation}</div>
      </div>
      <button class="bmark-rm" onclick="removeBookmark(event,${i})">✕</button>
    </li>
  `).join('');
}

window.removeBookmark = function(e, i) {
  e.stopPropagation();
  bookmarks.splice(i, 1);
  localStorage.setItem('q_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
};

window.jumpToBookmark = async function(key) {
  const [s, a] = key.split(':').map(Number);
  if (!currentSurah || currentSurah.number !== s) {
    closeDrawer('bookmarks-drawer');
    await selectSurah(s);
  }
  closeDrawer('bookmarks-drawer');
  const idx = currentSurah?.ayahs.findIndex(ay => ay.number === a) ?? -1;
  if (idx >= 0) {
    setTimeout(() => document.getElementById(`verse-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }
};

// ═══════════════════════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════════════════════
function initNotesModal() {
  $('notes-close').addEventListener('click', () => closeModal('notes-overlay'));
  notesOverlay.addEventListener('click', e => { if (e.target === notesOverlay) closeModal('notes-overlay'); });

  $('notes-save').addEventListener('click', () => {
    if (!currentSurah || notesActiveIdx < 0) return;
    const ayah = currentSurah.ayahs[notesActiveIdx];
    const key  = `${currentSurah.number}:${ayah.number}`;
    const text = $('notes-textarea').value.trim();
    if (text) {
      notes[key] = text;
    } else {
      delete notes[key];
    }
    localStorage.setItem('q_notes', JSON.stringify(notes));
    document.getElementById(`verse-${notesActiveIdx}`)?.classList.toggle('has-note', !!text);
    closeModal('notes-overlay');
    showToast(text ? 'Note saved 📝' : 'Note deleted');
  });

  $('notes-delete').addEventListener('click', () => {
    if (!currentSurah || notesActiveIdx < 0) return;
    const ayah = currentSurah.ayahs[notesActiveIdx];
    const key  = `${currentSurah.number}:${ayah.number}`;
    delete notes[key];
    localStorage.setItem('q_notes', JSON.stringify(notes));
    document.getElementById(`verse-${notesActiveIdx}`)?.classList.remove('has-note');
    closeModal('notes-overlay');
    showToast('Note deleted');
  });
}

window.openNote = function(e, idx) {
  e.stopPropagation();
  if (!currentSurah) return;
  notesActiveIdx = idx;
  const ayah = currentSurah.ayahs[idx];
  const key  = `${currentSurah.number}:${ayah.number}`;
  $('notes-title').textContent = `Note — ${currentSurah.name} ${ayah.number}`;
  $('notes-textarea').value = notes[key] || '';
  openModal('notes-overlay');
  setTimeout(() => $('notes-textarea').focus(), 100);
};

// ═══════════════════════════════════════════════════════════
// SHARE / COPY
// ═══════════════════════════════════════════════════════════
window.shareVerse = function(e, idx) {
  e.stopPropagation();
  if (!currentSurah) return;
  const ayah = currentSurah.ayahs[idx];
  // Strip HTML tags from arabic (tajweed version has spans)
  const arabicPlain = ayah.arabic.replace(/<[^>]+>/g, '');
  const text = `${arabicPlain}\n\n${ayah.translation}\n\n— ${currentSurah.name} ${ayah.number} (Quran ${currentSurah.number}:${ayah.number})`;
  navigator.clipboard?.writeText(text).then(() => showToast('Copied to clipboard! 📤'));
};

// ═══════════════════════════════════════════════════════════
// VOICE SEARCH
// ═══════════════════════════════════════════════════════════
function initVoiceModal() {
  $('voice-close').addEventListener('click', () => closeModal('voice-overlay'));
  voiceOverlay.addEventListener('click', e => { if (e.target === voiceOverlay) closeModal('voice-overlay'); });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceStart.textContent = 'Not supported in this browser';
    voiceStart.disabled = true;
    voiceStatus.textContent = 'Use Chrome for voice search';
    return;
  }

  const recog = new SpeechRecognition();
  recog.lang = 'ar-SA';
  recog.continuous = false;
  recog.interimResults = true;

  recog.onstart = () => {
    voiceOrb.classList.add('listening');
    voiceStatus.textContent = 'Listening… recite any verse';
    voiceStart.textContent = 'Stop';
  };
  recog.onend = () => {
    voiceOrb.classList.remove('listening');
    voiceStatus.textContent = 'Tap to search again';
    voiceStart.textContent = 'Start Listening';
  };
  recog.onresult = e => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
    voiceResult.textContent = transcript;
    if (e.results[e.results.length - 1].isFinal) {
      voiceStatus.textContent = 'Searching…';
      searchByArabicText(transcript);
    }
  };
  recog.onerror = err => {
    voiceStatus.textContent = `Error: ${err.error}`;
    voiceOrb.classList.remove('listening');
  };

  let listening = false;
  voiceStart.addEventListener('click', () => {
    if (listening) { recog.stop(); listening = false; }
    else { recog.start(); listening = true; }
  });
  voiceOrb.addEventListener('click', () => voiceStart.click());
}

async function searchByArabicText(query) {
  try {
    const res  = await fetch(`${API}/search/${encodeURIComponent(query)}/all/ar`);
    const json = await res.json();
    if (json.data?.matches?.length > 0) {
      const match = json.data.matches[0];
      voiceStatus.textContent = `Found: ${match.surah.englishName} ${match.numberInSurah}`;
      setTimeout(async () => {
        closeModal('voice-overlay');
        await selectSurah(match.surah.number);
        const idx = currentSurah?.ayahs.findIndex(a => a.number === match.numberInSurah) ?? -1;
        if (idx >= 0) setTimeout(() => { playAyah(idx); }, 500);
      }, 1200);
    } else {
      voiceStatus.textContent = 'No match found — try again';
    }
  } catch {
    voiceStatus.textContent = 'Search failed — try again';
  }
}

// ═══════════════════════════════════════════════════════════
// VERSE SEARCH
// ═══════════════════════════════════════════════════════════
function initVerseSearch() {
  let t;
  verseSearchIn.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (currentSurah) renderSurahPage(verseSearchIn.value);
    }, 220);
  });
}

// ═══════════════════════════════════════════════════════════
// STREAK & STATS
// ═══════════════════════════════════════════════════════════
function checkStreak() {
  const today    = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (stats.lastDate === today) {
    // Already active today — no change
  } else if (stats.lastDate === yesterday) {
    stats.streak++;
    stats.versesToday = 0;
  } else if (stats.lastDate && stats.lastDate !== today) {
    stats.streak = 1;
    stats.versesToday = 0;
  } else if (!stats.lastDate) {
    stats.streak = 1;
    stats.versesToday = 0;
  }
  stats.lastDate = today;
  saveStats();
}

function incrementVersesRead() {
  stats.totalVerses++;
  stats.versesToday++;
  saveStats();
  updateStatsUI();
  updateGoalUI();
}

function saveStats() { localStorage.setItem('q_stats', JSON.stringify(stats)); }

function updateStatsUI() {
  $('stat-streak').textContent = stats.streak;
  $('stat-today').textContent  = stats.versesToday;
  $('stat-goal').textContent   = dailyGoal;
  syncStatsToDrawer();
}

function syncStatsToDrawer() {
  $('sc-streak').textContent = stats.streak;
  $('sc-total').textContent  = stats.totalVerses;
  $('sc-surahs').textContent = stats.surahsDone.length;
  $('sc-today').textContent  = stats.versesToday;
}

function updateGoalUI() {
  const pct = Math.min(100, (stats.versesToday / dailyGoal) * 100);
  goalFill.style.width = `${pct}%`;
  goalStatus.textContent = `${stats.versesToday} / ${dailyGoal} verses`;
}

// ═══════════════════════════════════════════════════════════
// LAST POSITION RESTORE
// ═══════════════════════════════════════════════════════════
function restoreLastPosition() {
  const lastSurah = parseInt(localStorage.getItem('q_lastSurah'));
  if (lastSurah && lastSurah >= 1 && lastSurah <= 114) {
    setTimeout(() => selectSurah(lastSurah), 600);
  }
}

// ═══════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
}

// ═══════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════
init();
