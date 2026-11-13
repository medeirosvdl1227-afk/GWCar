/* ===== CONFIGURAÇÃO ===== */
var GW = {
  whatsapp: '5515996977511',
  mensagem: 'Olá, vim pelo site da GWcar e gostaria de consultar um horário para avaliação.'
};

/* Remove o mapa embutido se o servidor bloquear a incorporação (fica a alternativa com botão) */
document.addEventListener('securitypolicyviolation', function (e) {
  if (/google|frame/i.test(String(e.blockedURI) + e.violatedDirective)) {
    var f = document.querySelector('.map iframe'); if (f) f.remove();
  }
});

(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* links de WhatsApp com mensagem de origem */
  $$('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + GW.whatsapp + '?text=' + encodeURIComponent(GW.mensagem);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* eventos de clique (só são enviados se houver ferramenta de medição instalada) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-event]'); if (!a) return;
    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push({ event: a.getAttribute('data-event'), link_url: a.href });
    }
  });

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* navegação: esconde ao descer, volta ao subir */
  var nav = $('#nav'), fab = $('#fab'), burger = $('#burger'), menu = $('#menu');
  var hasHero = !!$('.hero');
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    var yy = window.scrollY;
    nav.classList.toggle('solid', !hasHero || yy > 40);
    if (!menu || !menu.classList.contains('open')) {
      if (yy > lastY + 6 && yy > 240) nav.classList.add('hide');
      else if (yy < lastY - 6 || yy < 120) nav.classList.remove('hide');
    }
    if (fab) fab.classList.toggle('show', yy > 420);
    lastY = yy; ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* menu do celular */
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { nav.classList.remove('hide'); var f = $('a', menu); if (f) f.focus(); }
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  if (menu) $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1100 && menu && menu.classList.contains('open')) setMenu(false); });

  /* indicador da seção ativa (página inicial) */
  var links = $$('.nav__links a.lnk[data-sec]');
  if ('IntersectionObserver' in window) {
    if (links.length) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-sec') === e.target.id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      links.forEach(function (a) { var s = document.getElementById(a.getAttribute('data-sec')); if (s) so.observe(s); });
    }
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    $$('.rise').forEach(function (el) { ro.observe(el); });
  } else {
    $$('.rise').forEach(function (el) { el.classList.add('in'); });
  }
})();
