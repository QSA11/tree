// ===== 导航栏滚动效果 =====
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');

// 判断当前是否为 portfolio 页面（有全屏遮罩即视为 portfolio）
const isPortfolio = !!document.getElementById('fsOverlay');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  // 非 portfolio 页面使用简单逻辑
  if (!isPortfolio && toTop) {
    toTop.classList.toggle('show', y > 500);
  }
});

// ===== 移动端菜单 =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('active');
  navLinks.classList.remove('open');
}));

// ===== 返回顶部 =====
if (toTop && !isPortfolio) {
  toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

// ===== 滚动渐入 =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      // 技能条动画
      e.target.querySelectorAll('.fill').forEach(f => {
        f.style.width = f.dataset.w + '%';
      });
      io.unobserve(e.target);
    }
  });
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
