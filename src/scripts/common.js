// Behaviour shared by more than one page. Everything here is driven by
// `data-js` / `data-modal` attributes, never by a visual class — restyling a
// page must not be able to break it (REDESIGN-PLAN.md rule 10).
//
// Lifted out of index.astro's inline script when /teams and /community moved
// onto the design system: teams had its own third copy of the modal logic
// (three near-identical open/close pairs) and community its own FAQ.
// Page-specific behaviour (tabs, carousel, lessons, streams, burger) stays
// inline on the page that owns it.

// --- FAQ accordion ---
// Three things move in lockstep: data-open on the row, aria-expanded on the
// question button, hidden on the answer.
document.querySelectorAll('[data-js="faq-row"]').forEach(function (row) {
  var toggle = row.querySelector('[data-js="faq-toggle"]');
  var answer = row.querySelector('.faq__a');
  if (!toggle || !answer) return;
  toggle.addEventListener('click', function () {
    var open = row.dataset.open === 'true';
    row.dataset.open = String(!open);
    toggle.setAttribute('aria-expanded', String(!open));
    answer.hidden = open;
  });
});

// --- generic modal system ---
// One implementation for every overlay on the site, keyed by
// data-modal="<name>" on the dialog and data-modal-open="<name>" on triggers.
(function () {
  var modals = {};
  document.querySelectorAll('[data-js="modal"]').forEach(function (m) {
    modals[m.getAttribute('data-modal')] = m;
  });
  if (!Object.keys(modals).length) return;
  var lastFocused = null;

  // idx.xl.ru application widget. Injected on FIRST open, not on page load:
  // it is a third-party render-blocking script and most visitors never open
  // the form. Several widget ids share one modal, so the mounted id is
  // tracked and the container emptied when it changes.
  var mountedWidgetId = null;
  function mountWidget(modal, widgetId) {
    var body = modal.querySelector('[data-js="widget-body"]');
    if (!body || widgetId === mountedWidgetId) return;
    body.innerHTML = '';
    mountedWidgetId = widgetId;
    var s = document.createElement('script');
    s.setAttribute('ao-number', '3272');
    s.setAttribute('ao-widget-id', widgetId);
    s.setAttribute('ao-domain', 'content.scalingclub.ru');
    s.src = 'https://idx.xl.ru/site/widget/widget.min.js';
    s.async = true;
    body.appendChild(s);
  }

  function openModal(name, widgetId) {
    var modal = modals[name];
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var dialog = modal.querySelector('.modal__dialog');
    if (dialog) dialog.focus();
    modal.querySelectorAll('[data-js="modal-video"]').forEach(function (iframe) {
      if (!iframe.getAttribute('src')) iframe.setAttribute('src', iframe.getAttribute('data-src'));
    });
    if (widgetId) mountWidget(modal, widgetId);
  }
  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = '';
    modal.querySelectorAll('[data-js="modal-video"]').forEach(function (iframe) { iframe.removeAttribute('src'); });
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }
  function openModals() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-js="modal"]')).filter(function (m) { return !m.hidden; });
  }

  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // close the home page's burger panel if it happens to be open
      var burgerPanel = document.getElementById('nav-panel');
      if (burgerPanel) burgerPanel.classList.remove('is-open');
      openModal(btn.getAttribute('data-modal-open'), btn.getAttribute('data-widget-id'));
    });
  });
  document.querySelectorAll('[data-js="modal-close"]').forEach(function (el) {
    el.addEventListener('click', function () {
      var modal = el.closest('[data-js="modal"]');
      if (modal) closeModal(modal);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    openModals().forEach(closeModal);
  });
})();
