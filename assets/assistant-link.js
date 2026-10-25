/* Open a lazy-loaded chat dialog; the link remains a no-JavaScript fallback. */
(function () {
  'use strict';
  var link = document.querySelector('.assistant-link');
  if (!link) return;
  var banner = document.getElementById('analyticsConsent');
  var popup = document.getElementById('assistantPopup');
  var frame = document.getElementById('assistantPopupFrame');
  var status = document.getElementById('assistantPopupStatus');
  var close = document.getElementById('assistantPopupClose');
  var origin = new URL(link.href).origin;

  function positionLink() {
    var bottom = 20;
    if (banner && !banner.hidden) {
      var notice = banner.getBoundingClientRect();
      var button = link.getBoundingClientRect();
      if (button.right > notice.left && button.left < notice.right) {
        bottom = Math.max(bottom, window.innerHeight - notice.top + 12);
      }
    }
    link.style.setProperty('--assistant-link-bottom', bottom + 'px');
  }
  if (banner) {
    new MutationObserver(positionLink).observe(banner, { attributes: true, attributeFilter: ['hidden'] });
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(positionLink).observe(banner);
  }
  window.addEventListener('resize', positionLink, { passive: true });
  positionLink();

  if (!popup || !frame || !close || typeof popup.showModal !== 'function') return;
  link.addEventListener('click', function (event) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (popup.open) return;
    popup.showModal();
    document.body.classList.add('assistant-popup-open');
    if (!frame.hasAttribute('src')) frame.src = new URL('/embed', link.href).href;
  });
  close.addEventListener('click', function () { popup.close(); });
  popup.addEventListener('close', function () {
    document.body.classList.remove('assistant-popup-open');
    link.focus();
  });
  popup.addEventListener('click', function (event) {
    if (event.target !== popup) return;
    var box = popup.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) popup.close();
  });
  frame.addEventListener('load', function () {
    if (!frame.hasAttribute('src')) return;
    status.hidden = true;
    frame.hidden = false;
  });
  window.addEventListener('message', function (event) {
    if (event.origin !== origin || event.source !== frame.contentWindow || !event.data || event.data.type !== 'arunodaycare:close-chat') return;
    if (popup.open) popup.close();
  });
})();
