/**
 * 解析日期字符串为时间戳
 * 格式: 2025年04月01日 10:30
 */
export function parseDate(dateStr: string): number {
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

