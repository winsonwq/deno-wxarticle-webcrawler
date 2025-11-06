// ==================== 用户代理和视口配置 ====================

// 按平台分类的用户代理列表
export const USER_AGENTS = {
  macOS: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0'
  ],
  Windows: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
  ],
  Linux: [
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0'
  ]
};

// 所有用户代理列表（用于向后兼容）
export const ALL_USER_AGENTS = [
  ...USER_AGENTS.macOS,
  ...USER_AGENTS.Windows,
  ...USER_AGENTS.Linux
];

// 随机视口大小
export const VIEWPORT_SIZES = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1280, height: 720 },
  { width: 1600, height: 900 }
];

/**
 * 获取随机用户代理（优先选择与平台匹配的）
 * @param preferPlatformMatch - 是否优先选择与平台匹配的 User-Agent（默认 true）
 */
export function getRandomUserAgent(preferPlatformMatch: boolean = true): string {
  if (!preferPlatformMatch) {
    return ALL_USER_AGENTS[Math.floor(Math.random() * ALL_USER_AGENTS.length)];
  }
  
  // 检测当前平台
  const platform = Deno.build.os;
  let platformKey: 'macOS' | 'Windows' | 'Linux' = 'Linux';
  
  switch (platform) {
    case 'darwin':
      platformKey = 'macOS';
      break;
    case 'linux':
      platformKey = 'Linux';
      break;
    case 'windows':
      platformKey = 'Windows';
      break;
  }
  
  // 80% 概率选择匹配平台的 User-Agent，20% 概率随机选择
  if (Math.random() < 0.8) {
    const platformAgents = USER_AGENTS[platformKey];
    return platformAgents[Math.floor(Math.random() * platformAgents.length)];
  } else {
    return ALL_USER_AGENTS[Math.floor(Math.random() * ALL_USER_AGENTS.length)];
  }
}

/**
 * 获取随机视口大小
 */
export function getRandomViewport(): { width: number; height: number } {
  return VIEWPORT_SIZES[Math.floor(Math.random() * VIEWPORT_SIZES.length)];
}

