// 导入工具模块
import { createStealthBrowser, setupStealthPage } from "./utils/stealth.ts";
import { parseDate } from "./utils/date.ts";

/**
 * 抓取微信公众号文章页面
 */
export async function fetchPage(url: string): Promise<string> {
  // 启动反检测浏览器
  const browser = await createStealthBrowser();
  const page = await browser.newPage();

  try {
    // 设置反检测页面
    await setupStealthPage(page);

    // 访问页面
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000
    });

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

