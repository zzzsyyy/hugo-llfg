let back2Top = document.querySelector('#back_to_top'),
   back2TopText = document.querySelector('#back_to_top_text'),
   viewport = document.querySelector('body');

function scrollAnimation(currentY, targetY) {

   let needScrollTop = targetY - currentY
   let _currentY = currentY
   setTimeout(() => {
      const dist = Math.ceil(needScrollTop / 10)
      _currentY += dist
      window.scrollTo(_currentY, currentY)
      if (needScrollTop > 10 || needScrollTop < -10) {
         scrollAnimation(_currentY, targetY)
      } else {
         window.scrollTo(_currentY, targetY)
      }
   }, 1)
}

back2Top.addEventListener("click", function (e) {
   scrollAnimation(document.scrollingElement.scrollTop, 0);
   e.stopPropagation();
   return false;
});

window.addEventListener('scroll', function (e) {
   let percent = document.scrollingElement.scrollTop / (document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight) * 100;
   if (percent > 1 && !back2Top.classList.contains('back-top-active')) {
      back2Top.classList.add('back-top-active');
   }
   if (percent == 0) {
      back2Top.classList.remove('back-top-active');
   }
   if (back2TopText) {
      back2TopText.textContent = Math.floor(percent);
   }
});
window.onresize = function () {
   calculHeight();
}
