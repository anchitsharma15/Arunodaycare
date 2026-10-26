(function () {
  'use strict';
  var menu = document.querySelector('.menu-button');
  var nav = document.getElementById('navigation');
  var mobile = window.matchMedia('(max-width: 800px)');
  function syncMenu() {
    if (!menu || !nav) return;
    menu.hidden = !mobile.matches;
    menu.setAttribute('aria-expanded', 'false');
    nav.hidden = mobile.matches;
  }
  if (menu && nav) {
    syncMenu();
    mobile.addEventListener('change', syncMenu);
    menu.addEventListener('click', function () {
      nav.hidden = !nav.hidden;
      menu.setAttribute('aria-expanded', String(!nav.hidden));
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a') && mobile.matches) syncMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobile.matches && !nav.hidden) {
        syncMenu(); menu.focus();
      }
    });
  }
  var filters = document.querySelector('.filters');
  if (filters) {
    filters.hidden = false;
    filters.addEventListener('click', function (event) {
      var button = event.target.closest('[data-filter]');
      if (!button) return;
      filters.querySelectorAll('button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      var count = 0;
      document.querySelectorAll('[data-category]').forEach(function (project) {
        project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
        if (!project.hidden) count++;
      });
      document.getElementById('filter-status').textContent = count + ' projects shown';
    });
  }
  function openLinkedDetail() {
    if (!location.hash) return;
    var target = document.getElementById(location.hash.slice(1));
    if (target && target.tagName === 'DETAILS') target.open = true;
  }
  openLinkedDetail();
  window.addEventListener('hashchange', openLinkedDetail);
  if (location.pathname === '/' || location.pathname.endsWith('/index.html')) {
    var legacy = { '#products': 'apps.html#examples', '#live-applications': 'apps.html#examples', '#training': 'business.html#training' };
    if (legacy[location.hash]) location.replace(legacy[location.hash]);
  }
})();
