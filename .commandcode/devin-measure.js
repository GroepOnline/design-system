(function() {
  function g(sel) { return document.querySelector(sel); }
  function s(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    var cs = getComputedStyle(el);
    return {
      rect: { w: Math.round(r.width), h: Math.round(r.height) },
      bg: cs.backgroundColor, text: cs.color,
      fs: cs.fontSize, fw: cs.fontWeight,
      radius: cs.borderRadius,
      p: cs.paddingTop + '/' + cs.paddingRight + '/' + cs.paddingBottom + '/' + cs.paddingLeft,
      border: cs.border
    };
  }
  var btns = document.querySelectorAll('button');
  return {
    url: location.href,
    title: document.title,
    measurements: {
      body: s(document.body),
      'nav-sidebar': s(g('nav')),
      'main': s(g('main')),
      'btn-primary': s(btns[0]),
      'btn-secondary': btns.length > 1 ? s(btns[1]) : null,
      'input': s(g('input, textarea')),
      'avatar': s(g('img[alt*="avatar" i], .avatar, [class*="Avatar"]')),
      'badge': s(g('.badge, [class*="pill"], [class*="chip"], [class*="status"]')),
      'composer': s(g('textarea, [data-testid*="composer"]')),
      'sidebar-link': s(document.querySelector('a[href*="/s"], a[href*="/sessions"], a[href^="/"]')),
      'worked-row': s(g('.worked, [class*="row"]')),
      'msg': s(document.querySelector('.msg, [class*="message"]'))
    }
  };
})();
