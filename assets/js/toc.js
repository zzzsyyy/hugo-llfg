function activateNavElementOnScroll() {
  const headers = document.querySelectorAll('.markdown h1, .markdown h2, .markdown h3');
  const headerLinks = document.querySelectorAll('.post-toc li a');
  const headerLinksArray = Array.from(headerLinks);

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    headers.forEach(header => {
      if (header.offsetTop - 300 < scrollY) {
        headerLinksArray.forEach(link => {
          link.classList.remove('active');
          
          const href = link.getAttribute('href');
          if (header.getAttribute('id') === href.slice(1)) {
            link.classList.add('active');
          }
        })
      }
    });
  });
}
