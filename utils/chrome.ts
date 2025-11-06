/**
 * 检测系统安装的 Chrome/Chromium 可执行文件路径
 * 支持 macOS 和 Linux 系统
 */
export function findChromePath(): string | undefined {
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

