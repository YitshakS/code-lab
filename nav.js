(function () {
  const currentTopic = new URLSearchParams(window.location.search).get('topic');

  const scriptSrc = document.currentScript?.src || '';
  const base = scriptSrc.replace(/nav\.js.*$/, '');

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = base + 'nav.css';
  document.head.appendChild(style);

  function buildHeader(topics) {
    const header = document.createElement('header');
    header.id = 'site-header';

    const logo = document.createElement('a');
    logo.id = 'site-logo';
    logo.href = '/';
    logo.textContent = 'Code Lab';

    const nav = document.createElement('nav');
    nav.id = 'site-nav';

    topics.forEach(t => {
      const a = document.createElement('a');
      a.href = `/?topic=${t.id}`;
      a.className = 'nav-item' + (t.id === currentTopic ? ' active' : '');
      a.textContent = t.title;
      nav.appendChild(a);
    });

    header.appendChild(logo);
    header.appendChild(nav);
    document.body.prepend(header);
    document.body.classList.add('has-site-header');
  }

  function init() {
    fetch(base + 'topics.json')
      .then(r => r.json())
      .then(buildHeader)
      .catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
