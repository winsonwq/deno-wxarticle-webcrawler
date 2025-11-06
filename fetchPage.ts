// 使用 Deno 官方的 Puppeteer 包
import puppeteer from "puppeteer";

/**
 * 解析日期字符串为时间戳
 * 格式: 2025年04月01日 10:30
 */
function parseDate(dateStr: string): number {
  const match = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日\s+(\d{2}):(\d{2})/);
  if (!match) {
    return Date.now();
  }
  
  const [, year, month, day, hour, minute] = match;
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  );
  
  return date.getTime();
}

/**
 * 检测系统安装的 Chrome/Chromium 可执行文件路径
 * 支持 macOS 和 Linux 系统
 */
function findChromePath(): string | undefined {
  const possiblePaths = [
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // Linux - Chromium
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
    // Linux - Google Chrome
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/snap/bin/chromium',
  ];

  for (const path of possiblePaths) {
    try {
      const stat = Deno.statSync(path);
      if (stat.isFile) {
        return path;
      }
    } catch {
      // 文件不存在，继续尝试下一个路径
    }
  }

  return undefined;
}

/**
 * 抓取微信公众号文章页面
 */
export async function fetchPage(url: string): Promise<string> {
  // 启动浏览器
  // 尝试使用系统安装的 Chrome/Chromium，避免需要下载浏览器二进制文件
  const chromePath = findChromePath();
  
  // Linux 无头模式推荐参数
  const launchArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage', // 避免 /dev/shm 空间不足
    '--disable-gpu', // 无头模式不需要 GPU
    '--no-first-run',
    '--no-zygote', // 在某些受限环境中需要
  ];

  const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
    headless: true,
    args: launchArgs,
  };
  
  // 如果找到系统 Chrome/Chromium，使用它
  if (chromePath) {
    launchOptions.executablePath = chromePath;
  }
  
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  try {
    // 访问页面
    await page.goto(url, { waitUntil: 'networkidle0' });

    // 获取页面内容
    const { title, publishTime, cover_image, content, summary } =
      await page.evaluate(() => {
        const title =
          document.querySelector('.rich_media_title')?.textContent?.trim() || '';
        const publishTime =
          document.querySelector('#publish_time')?.textContent?.trim() || '';
        const cover_image =
          document
            .querySelector('meta[property="og:image"]')
            ?.getAttribute('content') || '';

        const content = (
          document.querySelector('.rich_media_content')?.innerHTML || ''
        ).replace(/<img[^>]*data-src="([^"]*)"[^>]*>/g, '<img src="$1" />');

        const summary =
          document
            .querySelector('.rich_media_content')
            ?.textContent?.substring(0, 100) || '';

        return { title, publishTime, cover_image, content, summary };
      });

    // 将日期格式转换为时间戳
    const createdAt = parseDate(publishTime);
    const updatedAt = createdAt;

    const owner = '1839560857009676290';
    const createBy = '1839560857009676290';
    const updateBy = '1839560857009676290';
    const _openid = '1839560857009676290';
    const category = 'news';

    const article = JSON.stringify({
      title,
      summary,
      cover_image,
      content,
      owner,
      _openid,
      category,
      createdAt,
      updatedAt,
      createBy,
      updateBy,
    });

    // 可选：保存到文件
    // const filename = title.replace(/\//g, '_');
    // await Deno.writeTextFile(
    //   `articles/${filename}.json`,
    //   article
    // );

    return article;
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

