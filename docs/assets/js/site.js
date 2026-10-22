import { href, escapeHTML as e, loadJSON, searchDocuments } from './shared.mjs';

document.querySelectorAll('[data-video-src]').forEach((preview) => preview.addEventListener('click', (event) => {
  event.preventDefault();
  const frame = document.createElement('iframe');
  frame.src = preview.dataset.videoSrc;
  frame.title = 'Logic 모듈 조립 시연: 주문관리 앱을 작업보드로 바꾸기';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  preview.replaceWith(frame);
  frame.focus();
}));

const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('#main-nav');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? '주 메뉴 닫기' : '주 메뉴 열기');
  menu.classList.toggle('is-open', expanded);
});
const themeButton = document.querySelector('[data-theme-toggle]');
themeButton?.addEventListener('click', () => {
  const dark = document.documentElement.classList.toggle('dark');
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? '밝은 화면으로 전환' : '어두운 화면으로 전환');
  try { localStorage.setItem('logic-theme', dark ? 'dark' : 'light'); } catch {}
});
if (themeButton) {
  const dark = document.documentElement.classList.contains('dark');
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? '밝은 화면으로 전환' : '어두운 화면으로 전환');
}

document.querySelectorAll('.doc-sidebar-toggle').forEach((button) => button.addEventListener('click', () => {
  const sidebar = document.getElementById(button.getAttribute('aria-controls'));
  const expanded = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(expanded));
  sidebar.classList.toggle('is-open', expanded);
}));

document.querySelectorAll('.doc-article div[class*="language-"] button.copy').forEach((button) => {
  button.textContent = '복사';
  button.setAttribute('aria-label', '코드 복사');
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.parentElement.querySelector('code').innerText); button.textContent = '복사됨'; }
    catch { button.textContent = '복사할 수 없음'; }
  });
});

const dialog = document.createElement('dialog');
dialog.className = 'search-dialog';
dialog.setAttribute('aria-labelledby', 'document-search-title');
dialog.innerHTML = `<form method="dialog" class="search-dialog-top"><h2 id="document-search-title">문서 검색</h2><button aria-label="문서 검색 닫기">닫기 <kbd>Esc</kbd></button></form><label class="dialog-input-label"><span class="sr-only">문서 검색어</span><input type="search" aria-label="문서 검색어" placeholder="개념, 명령어, 오류 코드로 검색" autocomplete="off"></label><div class="search-dialog-status" role="status">검색어를 입력하세요.</div><ul class="doc-search-results"></ul>`;
document.body.append(dialog);
const input = dialog.querySelector('input');
const status = dialog.querySelector('[role="status"]');
const resultList = dialog.querySelector('ul');
let request = 0;
function openSearch() { dialog.showModal(); input.focus(); }
document.querySelectorAll('[data-open-search]').forEach((button) => button.addEventListener('click', openSearch));
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); if (dialog.open) dialog.close(); else openSearch();
  }
});
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
input.addEventListener('input', async () => {
  const id = ++request;
  const q = input.value.trim();
  resultList.replaceChildren();
  if (!q) { status.textContent = '검색어를 입력하세요.'; return; }
  status.textContent = '문서를 검색하는 중입니다.';
  try {
    const { items } = await loadJSON('search-index');
    if (id !== request) return;
    const matches = searchDocuments(items, q);
    status.textContent = matches.length ? `${matches.length}개 문서를 찾았습니다.` : '일치하는 문서가 없습니다.';
    resultList.innerHTML = matches.map((item) => `<li><a href="${e(href(item.path))}"><strong>${e(item.title)}</strong><span>${e(item.snippet)}</span></a></li>`).join('');
  } catch (error) { if (id === request) status.textContent = `문서 검색 데이터를 불러오지 못했습니다. ${error.message}`; }
});

if (document.querySelector('[data-stat]')) {
  loadJSON('meta').then((meta) => {
    for (const element of document.querySelectorAll('[data-stat]')) {
      if (meta.counts[element.dataset.stat] != null) element.firstChild.textContent = meta.counts[element.dataset.stat];
    }
  }).catch(() => {});
}
