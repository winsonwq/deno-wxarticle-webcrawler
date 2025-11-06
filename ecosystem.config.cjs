module.exports = {
  apps: [
    {
      name: 'wxarticle-api',
      script: 'deno',
      args: 'run --allow-net --allow-env --allow-read --allow-write --allow-run main.ts',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 8000,
        NODE_ENV: 'production',
      },
      // 日志配置
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      // 自动重启配置
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // 其他配置
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};

