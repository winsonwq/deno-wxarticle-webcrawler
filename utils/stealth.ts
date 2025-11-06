import puppeteer from 'https://github.com/lucacasonato/deno-puppeteer/raw/main/mod.ts';
import { getRandomUserAgent, getRandomViewport } from "./userAgent.ts";
import { findChromePath } from "./chrome.ts";
import { detectPlatform } from "./platform.ts";

// 定义页面类型
export type Page = Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>['newPage']>>;

/**
 * 创建反检测浏览器实例
 * 始终模拟 macOS 环境
 */
export async function createStealthBrowser() {
  // 始终使用 macOS User-Agent
  const userAgent = getRandomUserAgent('macOS');
  const viewport = getRandomViewport();
  
  console.log(`模拟平台: macOS, 使用用户代理: ${userAgent}`);
  console.log(`使用视口大小: ${viewport.width}x${viewport.height}`);

  const chromePath = findChromePath();

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: viewport,
    args: [
      `--window-size=${viewport.width},${viewport.height}`,
      '--disable-blink-features=AutomationControlled',
      '--disable-features=VizDisplayCompositor',
      '--disable-web-security',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-client-side-phishing-detection',
      '--disable-sync',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-plugins-discovery',
      '--disable-preconnect',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-hang-monitor',
      '--disable-domain-reliability',
      '--disable-component-extensions-with-background-pages',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI,BlinkGenPropertyTrees',
      '--no-first-run',
      '--no-default-browser-check',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--user-agent=' + userAgent,
      '--lang=zh-CN,zh,en-US,en',
      '--accept-lang=zh-CN,zh;q=0.9,en;q=0.8',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-client-side-phishing-detection',
      '--disable-default-apps',
      '--disable-hang-monitor',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-sync',
      '--metrics-recording-only',
      '--no-first-run',
      '--safebrowsing-disable-auto-update',
      '--enable-automation',
      '--password-store=basic',
      '--use-mock-keychain',
      '--disable-features=site-per-process',
      '--disable-ipc-flooding-protection'
    ],
    executablePath: chromePath,
  });

  return browser;
}

/**
 * 设置页面反检测
 * 始终模拟 macOS 环境
 * @param page - Puppeteer 页面对象
 * @param url - 目标URL（可选，用于设置正确的 Referer）
 */
export async function setupStealthPage(page: Page, url?: string): Promise<void> {
  // 始终使用 macOS User-Agent
  const userAgent = getRandomUserAgent('macOS');
  
  // 始终使用 macOS 平台标识
  const platformString = '"macOS"';
  const actualPlatform = detectPlatform();
  
  console.log(`实际平台: ${actualPlatform}, 模拟平台: macOS`);
  
  // 设置用户代理
  await page.setUserAgent(userAgent);
  
  // 设置视口
  const viewport = getRandomViewport();
  await page.setViewport(viewport);
  
  // 根据目标URL设置正确的 Referer 和 Sec-Fetch-Site
  const isWechatUrl = url && url.includes('mp.weixin.qq.com');
  const referer = isWechatUrl ? 'https://mp.weixin.qq.com/' : 'https://www.google.com/';
  const secFetchSite = isWechatUrl ? 'same-origin' : 'none';
  
  // 设置额外的HTTP头
  const headers: Record<string, string> = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Referer': referer,
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': secFetchSite,
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': platformString
  };
  
  await page.setExtraHTTPHeaders(headers);

  // 注入反检测脚本
  await page.evaluateOnNewDocument(() => {
    // 删除webdriver属性
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });

    // 删除automation相关属性
    // deno-lint-ignore no-explicit-any
    delete (globalThis as any).navigator.webdriver;
    // deno-lint-ignore no-explicit-any
    delete (globalThis as any).navigator.__proto__.webdriver;

    // 模拟真实的Chrome对象
    // deno-lint-ignore no-explicit-any
    (globalThis as any).chrome = {
      runtime: {},
      loadTimes: function() {},
      csi: function() {},
      app: {}
    };

    // 覆盖plugins属性
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    // 覆盖languages属性
    Object.defineProperty(navigator, 'languages', {
      get: () => ['zh-CN', 'zh', 'en-US', 'en'],
    });

    // 覆盖permissions属性
    const originalQuery = globalThis.navigator.permissions.query;
    globalThis.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        // deno-lint-ignore no-explicit-any
        Promise.resolve({ state: Notification.permission } as any) :
        originalQuery(parameters)
    );

    // 覆盖getParameter方法
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) {
        return 'Intel Inc.';
      }
      if (parameter === 37446) {
        return 'Intel Iris OpenGL Engine';
      }
      return getParameter(parameter);
    };

    // 添加真实的鼠标移动事件
    let _mouseX = 0, _mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      _mouseX = e.clientX;
      _mouseY = e.clientY;
    });

    // 模拟真实的屏幕分辨率
    Object.defineProperty(screen, 'width', { get: () => 1920 });
    Object.defineProperty(screen, 'height', { get: () => 1080 });
    Object.defineProperty(screen, 'availWidth', { get: () => 1920 });
    Object.defineProperty(screen, 'availHeight', { get: () => 1040 });
    Object.defineProperty(screen, 'colorDepth', { get: () => 24 });
    Object.defineProperty(screen, 'pixelDepth', { get: () => 24 });
  });

  // 设置地理位置
  await page.setGeolocation({ latitude: 39.9042, longitude: 116.4074 }); // 北京坐标

  // 设置时区
  await page.emulateTimezone('Asia/Shanghai');
}

