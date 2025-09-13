module.exports = {
  apps: [
    {
      name: 'whatsapp-service',
      script: 'whatsapp-service.js',
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/whatsapp-error.log',
      out_file: './logs/whatsapp-out.log',
      log_file: './logs/whatsapp-combined.log',
      time: true
    }
  ]
};
