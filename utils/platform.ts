/**
 * 检测操作系统平台
 */
export function detectPlatform(): 'macOS' | 'Windows' | 'Linux' {
  const platform = Deno.build.os;
  switch (platform) {
    case 'darwin':
      return 'macOS';
    case 'linux':
      return 'Linux';
    case 'windows':
      return 'Windows';
    default:
      return 'Linux'; // 默认返回 Linux
  }
}

/**
 * 从 User-Agent 中提取平台信息
 */
export function extractPlatformFromUserAgent(userAgent: string): 'macOS' | 'Windows' | 'Linux' {
  if (userAgent.includes('Macintosh') || userAgent.includes('Mac OS X')) {
    return 'macOS';
  } else if (userAgent.includes('Windows')) {
    return 'Windows';
  } else if (userAgent.includes('X11') || userAgent.includes('Linux')) {
    return 'Linux';
  }
  // 默认返回实际平台
  return detectPlatform();
}

/**
 * 获取平台标识字符串（用于 HTTP 头）
 */
export function getPlatformString(platform: 'macOS' | 'Windows' | 'Linux'): string {
  switch (platform) {
    case 'macOS':
      return '"macOS"';
    case 'Windows':
      return '"Windows"';
    case 'Linux':
      return '"Linux"';
  }
}

/**
 * 根据 User-Agent 获取匹配的平台标识
 * 确保 User-Agent 和平台标识一致
 */
export function getPlatformFromUserAgent(userAgent: string): string {
  const platform = extractPlatformFromUserAgent(userAgent);
  return getPlatformString(platform);
}

