# Linux 系统 Chrome/Chromium 安装指南

## 方法一：安装 Chromium（推荐，开源）

### Ubuntu/Debian 系统

```bash
# 更新包列表
sudo apt update

# 安装 Chromium
sudo apt install -y chromium-browser

# 或者安装 Chromium（某些发行版）
sudo apt install -y chromium
```

### CentOS/RHEL/Fedora 系统

```bash
# Fedora
sudo dnf install -y chromium

# CentOS/RHEL (需要 EPEL 仓库)
sudo yum install -y epel-release
sudo yum install -y chromium
```

### 验证安装

```bash
# 检查 Chromium 是否安装成功
which chromium-browser || which chromium

# 查看版本
chromium-browser --version || chromium --version
```

## 方法二：安装 Google Chrome

### Ubuntu/Debian 系统

```bash
# 下载并安装 Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb

# 清理下载文件
rm google-chrome-stable_current_amd64.deb
```

### CentOS/RHEL/Fedora 系统

```bash
# 下载并安装 Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
sudo yum install -y ./google-chrome-stable_current_x86_64.rpm

# 或者使用 dnf (Fedora)
sudo dnf install -y ./google-chrome-stable_current_x86_64.rpm

# 清理下载文件
rm google-chrome-stable_current_x86_64.rpm
```

### 验证安装

```bash
# 检查 Chrome 是否安装成功
which google-chrome

# 查看版本
google-chrome --version
```

## 方法三：使用 Puppeteer 自带的 Chromium

如果不想安装系统浏览器，可以让 Puppeteer 自动下载 Chromium。但由于 Deno 2.0+ 的兼容性问题，建议使用系统安装的浏览器。

## 安装必要的依赖库

Chrome/Chromium 在 Linux 上运行需要一些系统库，确保已安装：

### Ubuntu/Debian

```bash
sudo apt install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

### CentOS/RHEL/Fedora

```bash
# Fedora
sudo dnf install -y \
  alsa-lib \
  atk \
  cups-libs \
  gtk3 \
  ipa-gothic-fonts \
  libdrm \
  libXcomposite \
  libXdamage \
  libXext \
  libXfixes \
  libXrandr \
  libXScrnSaver \
  libXtst \
  pango \
  xorg-x11-fonts-100dpi \
  xorg-x11-fonts-75dpi \
  xorg-x11-utils

# CentOS/RHEL
sudo yum install -y \
  alsa-lib \
  atk \
  cups-libs \
  gtk3 \
  ipa-gothic-fonts \
  libdrm \
  libXcomposite \
  libXdamage \
  libXext \
  libXfixes \
  libXrandr \
  libXScrnSaver \
  libXtst \
  pango \
  xorg-x11-fonts-100dpi \
  xorg-x11-fonts-75dpi \
  xorg-x11-utils
```

## 常见路径

安装后，Chrome/Chromium 通常位于以下路径：

- **Chromium**: `/usr/bin/chromium-browser` 或 `/usr/bin/chromium`
- **Google Chrome**: `/usr/bin/google-chrome`

## 无头模式运行注意事项

在服务器环境（无图形界面）中运行 Chrome/Chromium 时，需要添加以下启动参数：

```javascript
args: [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-first-run',
  '--no-zygote',
  '--single-process', // 在某些情况下可能需要
]
```

## 测试安装

运行以下命令测试浏览器是否可以正常启动：

```bash
# 测试 Chromium
chromium-browser --headless --disable-gpu --dump-dom https://www.example.com || \
chromium --headless --disable-gpu --dump-dom https://www.example.com

# 测试 Chrome
google-chrome --headless --disable-gpu --dump-dom https://www.example.com
```

如果命令成功执行并输出 HTML 内容，说明浏览器安装正确。

