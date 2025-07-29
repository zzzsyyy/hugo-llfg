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

      const targetId = link.getAttribute('href').replace('#', '');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({ top: targetOffset, behavior: 'smooth' });
      }
    });
  });
  
  if (document.getElementById('TableOfContents')) {
    activateNavElementOnScroll();
  }
  
  switchBurger();
});
setTimeout(() => {
  history.replaceState('', document.title, window.location.origin + window.location.pathname + window.location.search)
}, 5);

function switchBurger() {
  let btn = document.getElementById('navbar-btn'),
    mobile = document.getElementById('is-mobile'),
    menu = document.getElementById('menu');
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden'),
      mobile.classList.toggle('hidden')
  });
  mobile.addEventListener('click', () => {
    menu.classList.toggle('hidden'),
      mobile.classList.toggle('hidden')
  })
}

function inlineMath() {
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false }
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
  });
}

function getNowTheme() {
  let nowTheme = document.body.getAttribute('data-theme');
  if (nowTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
      return nowTheme === 'dark' ? 'dark' : 'light';
  }
}

const rootElement = document.documentElement;
const darkModeStorageKey = 'user-color-scheme';
const darkModeMediaQueryKey = '--color-mode';
const rootElementDarkModeAttributeName = 'data-user-color-scheme';

const setLS = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch (e) { }
}

const removeLS = (k) => {
  try {
    localStorage.removeItem(k);
  } catch (e) { }
}

const getLS = (k) => {
  try {
    return localStorage.getItem(k);
  } catch (e) {
    return null
  }
}

const getModeFromCSSMediaQuery = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const resetRootDarkModeAttributeAndLS = () => {
  document.body.removeAttribute(rootElementDarkModeAttributeName);
  removeLS(darkModeStorageKey);
}

const validColorModeKeys = {
  'dark': true,
  'light': true
}

const applyCustomDarkModeSettings = (mode) => {
  const currentSetting = mode || getLS(darkModeStorageKey);

  if (currentSetting === getModeFromCSSMediaQuery()) {
    resetRootDarkModeAttributeAndLS();
  } else if (validColorModeKeys[currentSetting]) {
    document.body.setAttribute(rootElementDarkModeAttributeName, currentSetting);
  } else {
    resetRootDarkModeAttributeAndLS();
  }
}

const invertDarkModeObj = {
  'dark': 'light',
  'light': 'dark'
}

const toggleCustomDarkMode = () => {
  let currentSetting = getLS(darkModeStorageKey);
  
  if (validColorModeKeys[currentSetting]) {
    currentSetting = invertDarkModeObj[currentSetting];
  } else if (currentSetting === null) {
    currentSetting = invertDarkModeObj[getModeFromCSSMediaQuery()];
  } else {
    return;
  }
  setLS(darkModeStorageKey, currentSetting);

  return currentSetting;
}

document.addEventListener('DOMContentLoaded', function() {
  applyCustomDarkModeSettings();
  
  const darkModeTogglebuttonElement = document.getElementById('toggle-mode');
  if (darkModeTogglebuttonElement) {
    darkModeTogglebuttonElement.addEventListener('click', () => {
      applyCustomDarkModeSettings(toggleCustomDarkMode());
    });
  }
});
