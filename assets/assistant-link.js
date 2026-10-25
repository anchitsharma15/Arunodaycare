/* Keep the link above an overlapping consent notice; no chat or tracking loads here. */
(function () {
  'use strict';
  var link = document.querySelector('.assistant-link');
  var banner = document.getElementById('analyticsConsent');
  if (!link || !banner) return;

  function positionLink() {
    var bottom = 20;
    if (!banner.hidden) {
      var notice = banner.getBoundingClientRect();
      var button = link.getBoundingClientRect();
      if (button.right > notice.left && button.left < notice.right) {
        bottom = Math.max(bottom, window.innerHeight - notice.top + 12);
      }
    }
    link.style.setProperty('--assistant-link-bottom', bottom + 'px');
  }

  new MutationObserver(positionLink).observe(banner, { attributes: true, attributeFilter: ['hidden'] });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(positionLink).observe(banner);
  window.addEventListener('resize', positionLink, { passive: true });
  positionLink();
})();
