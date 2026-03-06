// Star Office UI - 游戏主逻辑 (离线模式)
// 不依赖后端 API，使用本地状态

// API 配置 - 使用相对路径（同域）
const API_BASE = "";

// 检测浏览器是否支持 WebP
let supportsWebP = false;

function checkWebPSupport() {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      resolve(canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);
    } else {
      resolve(false);
    }
  });
}

function checkWebPSupportFallback() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==';
  });
}

function getExt(pngFile) {
  if (pngFile === 'star-working-spritesheet.png') {
    return '.png';
  }
  if (LAYOUT.forcePng && LAYOUT.forcePng[pngFile.replace(/\.(png|webp)$/, '')]) {
    return '.png';
  }
  return supportsWebP ? '.webp' : '.png';
}

// 本地状态管理（不依赖后端）
const localState = {
  state: 'idle',
  detail: '待命中',
  progress: 0,
  updated_at: new Date().toISOString()
};

// 模拟 API 调用
async function mockFetch(url, options) {
  if (url.includes('/health')) {
    return { ok: true, json: () => Promise.resolve({ ok: true, status: 'healthy' }) };
  }
  if (url.includes('/status')) {
    return { ok: true, json: () => Promise.resolve({ ...localState, success: true }) };
  }
  if (url.includes('/yesterday-memo')) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { 
      ok: true, 
      json: () => Promise.resolve({ 
        success: true, 
        date: yesterday.toISOString().split('T')[0],
        memo: '昨日工作记录加载中...\n\n- 部署 Star Office 像素办公室\n- 修复 API 连接问题\n- 优化前端性能'
      }) 
    };
  }
  if (url.includes('/agents')) {
    return { ok: true, json: () => Promise.resolve({ agents: [] }) };
  }
  if (url.includes('/set_state')) {
    // 更新本地状态
    if (options && options.body) {
      try {
        const body = JSON.parse(options.body);
        localState.state = body.state || localState.state;
        localState.detail = body.detail || localState.detail;
        localState.updated_at = new Date().toISOString();
      } catch (e) {}
    }
    return { ok: true, json: () => Promise.resolve({ success: true }) };
  }
  return { ok: false, status: 404 };
}

// 替换全局 fetch
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string' && (url.includes('/health') || url.includes('/status') || url.includes('/yesterday-memo') || url.includes('/agents') || url.includes('/set_state'))) {
    return mockFetch(url, options);
  }
  return originalFetch.apply(this, arguments);
};

// 游戏配置
const config = {
  type: Phaser.AUTO,
  width: LAYOUT.game.width,
  height: LAYOUT.game.height,
  parent: 'game-container',
  pixelArt: true,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: { preload: preload, create: create, update: update }
};

let totalAssets = 0;
let loadedAssets = 0;
let loadingProgressBar, loadingProgressContainer, loadingOverlay, loadingText;

// Memo 相关函数
async function loadMemo() {
  const memoDate = document.getElementById('memo-date');
  const memoContent = document.getElementById('memo-content');

  try {
    const response = await fetch('/yesterday-memo?t=' + Date.now(), { cache: 'no-store' });
    const data = await response.json();

    if (data.success && data.memo) {
      memoDate.textContent = data.date || '';
      memoContent.innerHTML = data.memo.replace(/\n/g, '<br>');
    } else {
      memoContent.innerHTML = '<div id="memo-placeholder">暂无昨日日记</div>';
    }
  } catch (e) {
    console.error('加载 memo 失败:', e);
    memoContent.innerHTML = '<div id="memo-placeholder">加载失败</div>';
  }
}

function updateLoadingProgress() {
  loadedAssets++;
  const percent = Math.min(100, Math.round((loadedAssets / totalAssets) * 100));
  if (loadingProgressBar) {
    loadingProgressBar.style.width = percent + '%';
  }
  if (loadingText) {
    loadingText.textContent = `正在加载 Star 的像素办公室... ${percent}%`;
  }
}

function hideLoadingOverlay() {
  setTimeout(() => {
    if (loadingOverlay) {
      loadingOverlay.style.transition = 'opacity 0.5s ease';
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500);
    }
  }, 300);
}

// 初始化游戏
function initGame() {
  checkWebPSupport().then((supported) => {
    supportsWebP = supported;
    if (!supported) {
      return checkWebPSupportFallback();
    }
    return supported;
  }).then((supported) => {
    supportsWebP = supported;
    new Phaser.Game(config);
  });
}
