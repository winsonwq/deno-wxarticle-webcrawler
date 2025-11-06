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
 * 获取随机用户代理
 * @param mockPlatform - 要模拟的平台，如果指定则始终使用该平台的 User-Agent（默认 'macOS'）
 */
export function getRandomUserAgent(mockPlatform?: 'macOS' | 'Windows' | 'Linux'): string {
  // 默认模拟 macOS
  const targetPlatform = mockPlatform || 'macOS';
  const platformAgents = USER_AGENTS[targetPlatform];
  return platformAgents[Math.floor(Math.random() * platformAgents.length)];
}

/**
 * 获取随机视口大小
 */
export function getRandomViewport(): { width: number; height: number } {
  return VIEWPORT_SIZES[Math.floor(Math.random() * VIEWPORT_SIZES.length)];
}

