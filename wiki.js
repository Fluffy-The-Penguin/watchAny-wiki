// Sidebar toggle
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

// Active sidebar link highlight
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.sidebar-link').forEach(link => {
  const href = (link.getAttribute('href') || '').replace(/\/$/, '');
  if (href && !href.startsWith('http')) {
    const isActive = href === currentPath || (currentPath === '' && href === '/');
    link.classList.toggle('active', isActive);
  }
});

// FAQ accordion
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // close all
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Keyboard search shortcut
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    focusSearch();
  }
});

function focusSearch() {
  // placeholder — search coming in a future update
}

// Smooth scroll for TOC links
document.querySelectorAll('.toc a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
