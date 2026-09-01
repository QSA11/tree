// ===== Portfolio 专属逻辑 =====
(function(){
  const fsOverlay = document.getElementById('fsOverlay');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnFsClose = document.getElementById('btnFsClose');
  const toTop = document.getElementById('toTop');

  if (!fsOverlay) return;

  // ===== 全屏切换 =====
  function openFullscreen(){
    fsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // 全屏时滚动到顶部
    requestAnimationFrame(() => {
      const fsWrap = fsOverlay.querySelector('.fs-iframe-wrap');
      if (fsWrap) fsWrap.scrollTop = 0;
    });
  }
  function closeFullscreen(){
    fsOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  btnFullscreen.addEventListener('click', openFullscreen);
  btnFsClose.addEventListener('click', closeFullscreen);
  // Esc 退出全屏
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fsOverlay.classList.contains('active')) {
      closeFullscreen();
    }
  });

  // ===== 返回顶部：智能显示/隐藏 =====
  // 滚动到页面 50% 以下时出现；用户正在滚动时隐藏；停顿后重新判断
  let scrollTimer = null;
  let isScrolling = false;

  function handleScroll(){
    const y = window.scrollY;
    const threshold = window.innerHeight * 0.5; // 视口 50% 位置

    // 先清除之前的 timer
    if (scrollTimer) clearTimeout(scrollTimer);

    if (y > threshold) {
      // 超过阈值 → 显示，但如果正在滑动则先隐藏
      if (isScrolling) {
        toTop.classList.remove('show');
        toTop.classList.add('hide');
      } else {
        toTop.classList.add('show');
        toTop.classList.remove('hide');
      }
    } else {
      toTop.classList.remove('show');
      toTop.classList.add('hide');
    }

    // 设置滑动中标记
    isScrolling = true;
    scrollTimer = setTimeout(() => {
      isScrolling = false;
      // 停顿后重新判断是否需要显示
      if (window.scrollY > threshold) {
        toTop.classList.add('show');
        toTop.classList.remove('hide');
      }
    }, 1200); // 停顿 1.2s 后重新显示
  }

  // 主页面滚动
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 全屏遮罩内的滚动也要监听返回顶部
  const fsIframeWrap = fsOverlay.querySelector('.fs-iframe-wrap');
  if (fsIframeWrap) {
    fsIframeWrap.addEventListener('scroll', () => {
      const y = fsIframeWrap.scrollTop;
      const threshold = window.innerHeight * 0.5;

      if (scrollTimer) clearTimeout(scrollTimer);
      isScrolling = true;

      if (y > threshold) {
        toTop.classList.remove('show');
        toTop.classList.add('hide');
      }

      scrollTimer = setTimeout(() => {
        isScrolling = false;
        if (fsIframeWrap.scrollTop > threshold) {
          toTop.classList.add('show');
          toTop.classList.remove('hide');
        }
      }, 1200);
    }, { passive: true });
  }

  // 返回顶部点击
  toTop.addEventListener('click', () => {
    if (fsOverlay.classList.contains('active') && fsIframeWrap) {
      fsIframeWrap.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();
