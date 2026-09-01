// ===== 强制下载文件（兼容 file:// 与 http:// 两种环境）=====
// 问题背景：
//   - http(s):// 环境下 <a download> 本身就会直接下载；
//   - file:// 环境（双击打开 HTML）下 <a download> 会失效变成跳转预览，
//     而 fetch/XHR 又会被 CORS 拦截 → 之前"下载失败"的报错就来自这里。
// 方案：检测协议，file:// 下打开新窗口由浏览器 PDF 查看器自带"下载"按钮兜底，
//       http(s) 下走 blob 强制下载。
function downloadFile(url, filename) {
  const btns = document.querySelectorAll('[data-file="' + url + '"]');
  const isFileProtocol = window.location.protocol === 'file:';

  // file:// 环境：fetch 被 CORS 禁止，直接用隐藏链接点击 + 新窗口兜底
  if (isFileProtocol) {
    // 创建临时 <a download> 尝试触发（部分浏览器 file:// 下仍有效）
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || url.split('/').pop();
    a.target = '_blank';   // 若 download 失效则新标签打开 PDF 查看器（内含下载按钮）
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  // http(s) 环境：blob 强制下载
  btns.forEach(b => b.classList.add('downloading'));

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('文件不存在');
      return res.blob();
    })
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 1000);
    })
    .catch(err => {
      console.error('下载失败:', err);
      // 兜底：直接跳转文件链接，让浏览器自己处理
      window.open(url, '_blank');
    })
    .finally(() => {
      btns.forEach(b => b.classList.remove('downloading'));
    });
}

// 绑定所有带 data-file 属性的下载按钮
document.querySelectorAll('a[data-file]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    downloadFile(a.dataset.file, a.dataset.name);
  });
});
