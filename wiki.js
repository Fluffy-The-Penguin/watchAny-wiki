// ── GITHUB API ───────────────────────────────────────────────────────────
const RELEASES_API = 'https://api.github.com/repos/Fluffy-The-Penguin/watchAny-2.0/releases?per_page=20';

async function fetchLatestVersion() {
  const el = document.getElementById('sidebar-ver');
  if (!el) return;
  try {
    const res = await fetch('https://api.github.com/repos/Fluffy-The-Penguin/watchAny-2.0/releases/latest');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const ver = (data.tag_name || '').replace(/^v/, '');
    el.textContent = `v${ver} · latest`;
  } catch {
    el.textContent = 'watchAny 2.0';
  }
}

async function fetchReleases() {
  const container = document.getElementById('changelog-container');
  if (!container) return;
  try {
    const res = await fetch(RELEASES_API);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const releases = await res.json();
    if (!releases.length) {
      container.innerHTML = '<div class="changelog-loading">No releases found.</div>';
      return;
    }
    container.innerHTML = releases.map((rel, i) => {
      const ver = rel.tag_name || rel.name || 'Unknown';
      const date = rel.published_at ? new Date(rel.published_at).toISOString().slice(0, 10) : '';
      const body = rel.body || '';
      const lines = body.split('\n')
        .map(l => l.trim())
        .filter(l => l.startsWith('-') || l.startsWith('*') || l.startsWith('•'));
      const bullets = lines.length
        ? lines.map(l => {
            const text = l.replace(/^[-*•]\s*/, '');
            // detect prefix tags like "Fix:", "New:", "Improve:"
            const tagMatch = text.match(/^(fix|new|improve|feat|chore|style|refactor|docs|breaking)[:\s]/i);
            let tag = '';
            let rest = text;
            if (tagMatch) {
              const t = tagMatch[1].toLowerCase();
              const cls = t === 'fix' ? 'tag-fix' : t === 'new' || t === 'feat' ? 'tag-new' : 'tag-imp';
              const label = t === 'fix' ? 'Fix' : t === 'new' || t === 'feat' ? 'New' : 'Improve';
              tag = `<span class="tag ${cls}">${label}</span>`;
              rest = text.slice(tagMatch[0].length);
            }
            return `<li>${tag}${escHtml(rest)}</li>`;
          }).join('')
        : `<li>${escHtml(body.slice(0, 200) || 'See GitHub for details.')}</li>`;
      return `
        <div class="changelog-item">
          <div class="changelog-version">${escHtml(ver)}${i === 0 ? ' <span class="tag tag-new">Latest</span>' : ''}</div>
          ${date ? `<div class="changelog-date">${date}</div>` : ''}
          <ul class="changelog-list">${bullets}</ul>
        </div>`;
    }).join('');
  } catch (err) {
    container.innerHTML = `
      <div class="changelog-loading" style="color:rgba(255,255,255,0.4)">
        ⚠️ Could not load releases. <a href="https://github.com/Fluffy-The-Penguin/watchAny-2.0/releases" target="_blank" style="color:var(--accent2)">View on GitHub</a>
      </div>`;
  }
}

// ── SEARCH INDEX ──────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  // Introduction
  { page: 'Introduction', url: '/', section: 'Overview', text: 'watchAny is a free open-source media center built with Flutter that runs on Windows and Android. It plays virtually anything — local files, direct URLs, HLS streams, DASH streams, torrents via magnet links.' },
  { page: 'Introduction', url: '/', section: 'Key highlights', text: 'Hardware-accelerated playback via libmpv with 4K HDR Dolby Vision support. Anime manga dashboard AniList integration OAuth sync. Movies series discovery TMDB Continue Watching history. Built-in TorrServer for magnet link playback.' },
  { page: 'Introduction', url: '/', section: 'Platform Support', text: 'Windows 10 11 x64 full feature set installer portable ZIP available. Android 7.0+ ARM64 ARMv7 x86_64 split APKs.' },

  // Installation
  { page: 'Installation', url: '/installation', section: 'Windows Installer', text: 'Download watchany_setup.exe from the latest release. Installs to Program Files creates Start Menu shortcut registers uninstaller.' },
  { page: 'Installation', url: '/installation', section: 'Windows Portable ZIP', text: 'Download watchany_portable.zip extract anywhere USB drive Desktop run watch_any.exe directly no installation needed portable.' },
  { page: 'Installation', url: '/installation', section: 'SmartScreen Warning', text: 'Windows SmartScreen may show a warning unsigned app. Click More info then Run anyway. The app is open-source and safe.' },
  { page: 'Installation', url: '/installation', section: 'Android APK', text: 'Three APK variants arm64-v8a armeabi-v7a x86_64. For most modern phones use arm64-v8a. Settings Security Install unknown apps.' },
  { page: 'Installation', url: '/installation', section: 'System Requirements', text: 'Windows 10 or 11 64-bit 4GB RAM 200MB disk DirectX 11 GPU. Android 7.0 Nougat 2GB RAM 150MB storage.' },
  { page: 'Installation', url: '/installation', section: 'First Launch', text: 'Setup Wizard lets you choose which sections to enable Anime Movies Manga. No account required. AniList sync optional from Profile page.' },

  // Features
  { page: 'Features', url: '/features', section: 'Hardware-Accelerated Player', text: 'Powered by libmpv handles 4K HDR Dolby Vision HEVC 10-bit AV1 virtually any codec without buffering.' },
  { page: 'Features', url: '/features', section: 'Anime Dashboard', text: 'Browse Trending Top Rated Seasonal Continue Watching rails. Pulls live data from AniList API.' },
  { page: 'Features', url: '/features', section: 'Movies & Series', text: 'Full TMDB integration. Discover new releases popular titles track watch history.' },
  { page: 'Features', url: '/features', section: 'Manga Reader', text: 'Browse and read manga with chapter tracking bookmarks AniList progress sync.' },
  { page: 'Features', url: '/features', section: 'Torrent Playback', text: 'Built-in TorrServer streams magnet links directly. Start watching while torrent downloads no client needed.' },
  { page: 'Features', url: '/features', section: 'HLS & DASH Streams', text: 'Paste any m3u8 or mpd URL and start playing instantly. Works with most IPTV and streaming sources.' },
  { page: 'Features', url: '/features', section: 'AniList Sync', text: 'Connect your AniList account to sync library track episode progress update scores automatically.' },
  { page: 'Features', url: '/features', section: 'HStream Extensions', text: 'Load Keiyoushi-compatible anime extension sources JavaScript-based plugins stream anime providers.' },
  { page: 'Features', url: '/features', section: 'Player Capabilities', text: 'Subtitle support SRT ASS SSA embedded external. Audio tracks dubbed subbed. Chapter navigation. Playback speed 0.25x to 4x. Resume playback. Episode switching. Download manager. Screen lock.' },
  { page: 'Features', url: '/features', section: 'Continue Watching', text: 'Hover over any card in Continue Watching rail to reveal a delete button click it to remove from history.' },

  // Media Sources
  { page: 'Media Sources', url: '/sources', section: 'Direct URLs', text: 'Paste any direct video URL into the search bar. MP4 MKV AVI MOV WEBM FLV direct file links HTTP HTTPS RTMP.' },
  { page: 'Media Sources', url: '/sources', section: 'Torrents Magnet Links', text: 'Paste a magnet link to stream via built-in TorrServer. No external torrent client needed streams while downloading. Multi-file picker cache.' },
  { page: 'Media Sources', url: '/sources', section: 'HLS DASH Streams', text: 'Paste HLS DASH manifest URL m3u8 mpd live or VOD stream playback IPTV adaptive bitrate quality switching.' },
  { page: 'Media Sources', url: '/sources', section: 'Local Files', text: 'Open local video file using file picker drag drop Windows. MKV MP4 AVI MOV WEBM FLV TS M2TS. External subtitle files SRT ASS same folder auto-detected.' },
  { page: 'Media Sources', url: '/sources', section: 'HStream Extensions', text: 'Keiyoushi-compatible anime extension sources. Settings HStream add source URL. Isolated JavaScript runtime.' },
  { page: 'Media Sources', url: '/sources', section: 'IPTV M3U Playlists', text: 'Load .m3u playlist files each channel becomes a playable item IPTV.' },

  // FAQ
  { page: 'FAQ', url: '/faq', section: 'Is watchAny free?', text: 'Yes completely free and open source. No ads no subscriptions no premium tier. Source code on GitHub.' },
  { page: 'FAQ', url: '/faq', section: 'Windows SmartScreen warning', text: 'Warning appears because app is not code-signed. Click More info then Run anyway. Source code is public open-source safe.' },
  { page: 'FAQ', url: '/faq', section: 'AniList account required?', text: 'No account needed. Browse anime play torrents use all features without account. AniList only needed for library sync watch progress ratings.' },
  { page: 'FAQ', url: '/faq', section: 'Which Android APK to download?', text: 'Most modern phones arm64-v8a. Older devices armeabi-v7a. Emulators x86_64.' },
  { page: 'FAQ', url: '/faq', section: 'Video choppy not playing smoothly', text: 'Update GPU drivers. For 4K check system requirements. Try different stream quality or source. For torrents wait for more data to buffer.' },
  { page: 'FAQ', url: '/faq', section: 'Remove item from Continue Watching', text: 'Hover over any card in Continue Watching rail and click the X button that appears in top-left corner. Immediately removes from history.' },
  { page: 'FAQ', url: '/faq', section: 'Update Available after updating', text: 'Bug fixed in v2.0.34. Update to the latest version and the prompt will no longer appear incorrectly.' },
  { page: 'FAQ', url: '/faq', section: 'macOS Linux support', text: 'Not officially available. Built with Flutter could theoretically run macOS Linux. No official builds. Compile from source.' },
  { page: 'FAQ', url: '/faq', section: 'Report bug or request feature', text: 'Open an issue on GitHub Issues page. Include OS app version steps to reproduce.' },

  // Changelog
  { page: 'Changelog', url: '/changelog', section: 'v2.0.34 — Latest', text: 'Fix trending buffering spinner. Upgrade images to extraLarge resolution. Fix update available dialog. New delete from Continue Watching hover X button.' },
  { page: 'Changelog', url: '/changelog', section: 'v2.0.33', text: 'Smooth borderless startup window resizing animation. Custom bounce zoom-in app transition. Splash screen diagonal shine sweep.' },
  { page: 'Changelog', url: '/changelog', section: 'v2.0.32', text: 'Setup Wizard first-time configuration. Customizable homepage sections enable disable Anime Movies Manga. Isolated watch history. Instant startup.' },
  { page: 'Changelog', url: '/changelog', section: 'v2.0.31', text: 'Fix HStream inline player episode switching and download support. Service isolation startup stability.' },
  { page: 'Changelog', url: '/changelog', section: 'v2.0.30', text: 'Movies series dashboard TMDB integration. Continue Watching history for movies. Dark layout cards.' },
  { page: 'Changelog', url: '/changelog', section: 'v2.0.27', text: 'AniList OAuth integration. Two-way library synchronization. Watch progress syncing. Profile page statistics dashboard.' },
];

function searchIndex(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return SEARCH_INDEX.filter(entry => {
    const haystack = (entry.page + ' ' + entry.section + ' ' + entry.text).toLowerCase();
    return terms.every(t => haystack.includes(t));
  }).slice(0, 8);
}

// ── SEARCH MODAL ──────────────────────────────────────────────────────────
function buildSearchModal() {
  const modal = document.createElement('div');
  modal.id = 'search-modal';
  modal.innerHTML = `
    <div id="search-backdrop" onclick="closeSearch()"></div>
    <div id="search-box">
      <div id="search-input-wrap">
        <span id="search-icon">🔍</span>
        <input id="search-input" type="text" placeholder="Search docs…" autocomplete="off" spellcheck="false"/>
        <kbd id="search-esc" onclick="closeSearch()">Esc</kbd>
      </div>
      <div id="search-results"></div>
      <div id="search-footer">
        <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span><kbd>↵</kbd> open</span>
        <span><kbd>Esc</kbd> close</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const input = modal.querySelector('#search-input');
  const results = modal.querySelector('#search-results');

  let selectedIdx = -1;

  input.addEventListener('input', () => {
    selectedIdx = -1;
    renderResults(results, input.value);
  });

  input.addEventListener('keydown', e => {
    const items = results.querySelectorAll('.sr-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
      updateSelected(items, selectedIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, 0);
      updateSelected(items, selectedIdx);
    } else if (e.key === 'Enter') {
      if (selectedIdx >= 0 && items[selectedIdx]) {
        items[selectedIdx].click();
      } else if (items[0]) {
        items[0].click();
      }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });
}

function updateSelected(items, idx) {
  items.forEach((el, i) => el.classList.toggle('selected', i === idx));
  if (items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
}

function renderResults(container, query) {
  if (!query.trim()) {
    container.innerHTML = '<div class="sr-empty">Start typing to search…</div>';
    return;
  }
  const hits = searchIndex(query);
  if (!hits.length) {
    container.innerHTML = `<div class="sr-empty">No results for "<strong>${escHtml(query)}</strong>"</div>`;
    return;
  }
  const highlighted = q => {
    const terms = query.toLowerCase().split(/\s+/);
    let s = escHtml(q);
    terms.forEach(t => {
      if (!t) return;
      s = s.replace(new RegExp(escRegex(escHtml(t)), 'gi'), m => `<mark>${m}</mark>`);
    });
    return s;
  };
  container.innerHTML = hits.map((h, i) => `
    <div class="sr-item${i === 0 ? ' selected' : ''}" onclick="window.location.href='${h.url}'">
      <div class="sr-page">${escHtml(h.page)}</div>
      <div class="sr-section">${highlighted(h.section)}</div>
      <div class="sr-snippet">${highlighted(h.text.slice(0, 100))}…</div>
    </div>
  `).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
}

let searchOpen = false;

function openSearch() {
  if (!document.getElementById('search-modal')) buildSearchModal();
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  modal.classList.add('open');
  results.innerHTML = '<div class="sr-empty">Start typing to search…</div>';
  input.value = '';
  setTimeout(() => input.focus(), 50);
  searchOpen = true;
}

function closeSearch() {
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.remove('open');
  searchOpen = false;
}

function focusSearch() { openSearch(); }

// ── SIDEBAR ───────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('open');
  });
}

function closeSidebar() {
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('open');
}

// Active sidebar link
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.sidebar-link').forEach(link => {
  const href = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
  if (!href.startsWith('http')) {
    link.classList.toggle('active', href === currentPath);
  }
});

// ── KEYBOARD SHORTCUTS ────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchOpen ? closeSearch() : openSearch();
  }
  if (e.key === 'Escape' && searchOpen) closeSearch();
});

// ── FAQ ACCORDION ─────────────────────────────────────────────────────────
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchLatestVersion();
  fetchReleases();
});

// ── TOC SMOOTH SCROLL ─────────────────────────────────────────────────────
document.querySelectorAll('.toc a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
