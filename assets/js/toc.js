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
  const headerLinks = document.querySelectorAll('.post-toc li a');
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
