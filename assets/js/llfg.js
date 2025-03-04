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
const darkModeTogglebuttonElement = document.getElementById('toggle-mode');

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
    return null // 与 localStorage 中没有找到对应 key 的行为一致
  }
}

const getModeFromCSSMediaQuery = () => {
  // 使用 matchMedia API 的写法会优雅的多
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const resetRootDarkModeAttributeAndLS = () => {
  rootElement.removeAttribute(rootElementDarkModeAttributeName);
  removeLS(darkModeStorageKey);
}

// document.getElementById('toggle-mode').addEventListener('click', () => {
//   let nowTheme = getNowTheme();
//   let domTheme = document.body.getAttribute('data-theme');
//   let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

//   if (domTheme === 'auto') {
//       document.body.setAttribute('data-theme', nowTheme === 'light' ? 'dark' : 'light');
//       localStorage.setItem('fuji_data-theme', nowTheme === 'light' ? 'dark' : 'light');
//   } else if (domTheme === 'light') {
//       document.body.setAttribute('data-theme', 'dark');
//       localStorage.setItem('fuji_data-theme', systemTheme === 'dark' ? 'auto' : 'dark');
//   } else {
//       document.body.setAttribute('data-theme', 'light');
//       localStorage.setItem('fuji_data-theme', systemTheme === 'light' ? 'auto' : 'light');
//   }
// }
// )

const validColorModeKeys = {
  'dark': true,
  'light': true
}

const applyCustomDarkModeSettings = (mode) => {
  // 接受从「开关」处传来的模式，或者从 localStorage 读取
  const currentSetting = mode || getLS(darkModeStorageKey);

  if (currentSetting === getModeFromCSSMediaQuery()) {
    // 当用户自定义的显示模式和 prefers-color-scheme 相同时重置、恢复到自动模式
    resetRootDarkModeAttributeAndLS();
  } else if (validColorModeKeys[currentSetting]) { // 相比 Array#indexOf，这种写法 Uglify 后字节数更少
    rootElement.setAttribute(rootElementDarkModeAttributeName, currentSetting);
  } else {
    // 首次访问或从未使用过开关、localStorage 中没有存储的值，currentSetting 是 null
    // 或者 localStorage 被篡改，currentSetting 不是合法值
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
    // 从 localStorage 中读取模式，并取相反的模式
    currentSetting = invertDarkModeObj[currentSetting];
  } else if (currentSetting === null) {
    // localStorage 中没有相关值，或者 localStorage 抛了 Error
    // 从 CSS 中读取当前 prefers-color-scheme 并取相反的模式
    currentSetting = invertDarkModeObj[getModeFromCSSMediaQuery()];
  } else {
    // 不知道出了什么幺蛾子，比如 localStorage 被篡改成非法值
    return; // 直接 return;
  }
  // 将相反的模式写入 localStorage
  setLS(darkModeStorageKey, currentSetting);

  return currentSetting;
}

applyCustomDarkModeSettings();

darkModeTogglebuttonElement.addEventListener('click', () => {
  // 当用户点击「开关」时，获得新的显示模式、写入 localStorage、并在页面上生效
  applyCustomDarkModeSettings(toggleCustomDarkMode());
})
