'use strict';

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');

if (toggle && nav) {
  // Match the CSS breakpoint; navigation stays visible until enhancement succeeds.
  const mobile = window.matchMedia('(max-width: 760px)');
  const header = toggle.closest('.site-header');
  const setOpen = (open, returnFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.querySelector('span').textContent = open ? '✕' : '☰';
    nav.classList.toggle('is-open', open);
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !mobile.matches) return;
    setOpen(false);
    // Do not leave keyboard focus in a newly hidden navigation panel.
    document.querySelector(link.getAttribute('href'))?.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, nav.contains(document.activeElement));
    }
  });

  header.addEventListener('focusout', (event) => {
    if (header.contains(event.relatedTarget)) return;
    // CSS can hide the focused control before the media-query event fires.
    if (!event.relatedTarget && mobile.matches && nav.contains(event.target)) {
      setOpen(false, true);
    } else if (!event.relatedTarget && !mobile.matches && event.target === toggle) {
      setOpen(false);
      nav.querySelector('a').focus();
    } else {
      setOpen(false);
    }
  });

  mobile.addEventListener('change', () => {
    const focusWillHide = mobile.matches && nav.contains(document.activeElement);
    const toggleWillHide = !mobile.matches && document.activeElement === toggle;
    setOpen(false, focusWillHide);
    if (toggleWillHide) nav.querySelector('a').focus();
  });

  header.classList.add('nav-enhanced');
  toggle.hidden = false;
}
