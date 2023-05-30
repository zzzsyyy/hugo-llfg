function debounce(fn, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(context, args), delay);
  };
}

function activateNavElementOnScroll() {
  const headers = document.querySelectorAll('.markdown h1, .markdown h2, .markdown h3');
  const headerLinks = document.querySelectorAll('#TableOfContents li a');
  const positions = {};

  for (const header of headers) {
    positions[header.id] = header.offsetTop;
  }

  let activeLink = null;

  window.addEventListener('scroll', debounce(() => {
    const scrollY = window.scrollY;
    for (const [id, position] of Object.entries(positions)) {
      if (position - 60 < scrollY) {
        const href = `#${id}`;
        if (activeLink) {
          activeLink.classList.remove('active');
        }
        for (const link of headerLinks) {
          if (link.getAttribute('href') === href) {
            link.classList.add('active');
            activeLink = link;
          } else {
            link.classList.remove('active');
          }
        }
      }
    }
  }), 200);
}

document.addEventListener('DOMContentLoaded', function () {
  const acl = document.querySelectorAll('#TableOfContents li a');
  acl.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight; // 根据实际情况获取页眉高度
        const targetOffset = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({ top: targetOffset, behavior: 'smooth' });
      }
    });
  });
});
setTimeout(() => {
  history.replaceState('', document.title, window.location.origin + window.location.pathname + window.location.search)
}, 5);
