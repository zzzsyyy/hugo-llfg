let back2Top = document.querySelector('#back_to_top'),
   back2TopText = document.querySelector('#back_to_top_text'),
   viewport = document.querySelector('body');

function scrollAnimation(currentY, targetY) {
  const animation = () => {
    const needScrollTop = targetY - currentY;
    const dist = Math.ceil(needScrollTop / 10);
    currentY += dist;
    window.scrollTo(currentY, currentY);
    if (needScrollTop > 10 || needScrollTop < -10) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(currentY, targetY);
    }
  };
  requestAnimationFrame(animation);
}

function handleBackToTopClick(e) {
  e.stopPropagation();
  scrollAnimation(document.scrollingElement.scrollTop, 0);
}

function handleWindowScroll(e) {
  const percent = document.scrollingElement.scrollTop / (document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight) * 100;
  if (percent > 1 && !back2Top.classList.contains('back-top-active')) {
    back2Top.classList.add('back-top-active');
  }
  if (percent == 0) {
    back2Top.classList.remove('back-top-active');
  }
  requestAnimationFrame(() => {
    if (back2TopText) {
      back2TopText.textContent = Math.floor(percent);
    }
  });
}

back2Top.addEventListener("click", handleBackToTopClick);
window.addEventListener('scroll', handleWindowScroll);
