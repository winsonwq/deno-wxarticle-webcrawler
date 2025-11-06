# Deno 版本使用说明

## 安装 Deno

如果还没有安装 Deno，请访问 https://deno.land 安装。

## 运行 API 服务

启动公开的 API 服务：

```bash
deno task api
```

或者直接运行：

```bash
deno run --allow-net --allow-env --allow-read --allow-write --allow-run main.ts
```

服务默认运行在 `http://localhost:8000`

## 使用 PM2 长期运行（推荐用于生产环境）

### 安装 PM2

```bash
npm install -g pm2
```

### 启动服务

使用配置文件启动：

```bash
pm2 start ecosystem.config.cjs
```

或者直接启动：

```bash
pm2 start deno --name wxarticle-api --interpreter none -- \
  run --allow-net --allow-env --allow-read --allow-write --allow-run main.ts
```

### PM2 常用命令

```bash
# 查看运行状态
pm2 status

# 查看日志
pm2 logs wxarticle-api

# 停止服务
pm2 stop wxarticle-api

# 重启服务
pm2 restart wxarticle-api

# 删除服务
pm2 delete wxarticle-api

# 设置开机自启
pm2 startup
pm2 save
```

### 自定义端口

修改 `ecosystem.config.cjs` 中的 `PORT` 环境变量，或使用环境变量启动：

```bash
PORT=3000 pm2 start ecosystem.config.cjs --update-env
```

### 日志文件

日志文件保存在 `./logs/` 目录下：
- `pm2-error.log`: 错误日志
- `pm2-out.log`: 标准输出日志
- `pm2-combined.log`: 合并日志

首次运行前需要创建日志目录：

```bash
mkdir -p logs
```

## API 使用示例

### GET 请求

```bash
curl "http://localhost:8000/api?url=https://mp.weixin.qq.com/s/xxxxx"
```

### POST 请求

```bash
curl -X POST http://localhost:8000/api \
  -H "Content-Type: application/json" \
  -d '{"url": "https://mp.weixin.qq.com/s/xxxxx"}'
```

### 响应格式

成功响应：
```json
{
  "success": true,
  "data": {
    "title": "文章标题",
    "summary": "文章摘要",
    "cover_image": "封面图片URL",
    "content": "文章HTML内容",
    "owner": "1839560857009676290",
    "_openid": "1839560857009676290",
    "category": "news",
    "createdAt": 1234567890000,
    "updatedAt": 1234567890000,
    "createBy": "1839560857009676290",
    "updateBy": "1839560857009676290"
  }
}
```

错误响应：
```json
{
  "success": false,
  "error": "错误信息"
}
```

## 环境变量

- `PORT`: 服务器端口号（默认: 8000）

```bash
PORT=3000 deno task api
```

## 注意事项

1. **Linux 系统**: 在 Linux 上运行前，需要先安装 Chrome 或 Chromium。详细安装指南请参考 [LINUX_SETUP.md](./LINUX_SETUP.md)
2. **macOS 系统**: 如果已安装 Google Chrome，代码会自动使用系统 Chrome
3. 如果系统未安装浏览器，首次运行时会尝试自动下载 Puppeteer 和 Chromium（但 Deno 2.0+ 可能存在兼容性问题）
4. 确保有足够的磁盘空间（Chromium 大约需要 200MB）
5. API 服务支持 CORS，可以从任何域名访问

