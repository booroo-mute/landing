const path = require('path');

module.exports = {
  apps: [{
    name: 'mute-landing',
    script: 'npm',
    // Loopback only: nginx on this host proxies mute.ac to 127.0.0.1:3002, and
    // nothing else should reach the Next server directly (20 Oct 2026).
    // pm2 reads args at start, not restart: apply with
    // `pm2 delete mute-landing && pm2 start ecosystem.config.js && pm2 save`.
    args: 'start -- -H 127.0.0.1',
    cwd: path.resolve(__dirname),
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    time: true
  }]
};
