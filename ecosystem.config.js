module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'start.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'development',
        PORT: 8080
      },
      watch: ['index.js', 'routes', 'controllers', 'services', 'models', 'config'],
      ignore_watch: ['node_modules', 'logs', '*.log', 'start.js'],
      instances: 1,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      error_file: '../logs/backend-error.log',
      out_file: '../logs/backend-out.log',
      time: true
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development'
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      error_file: '../logs/frontend-error.log',
      out_file: '../logs/frontend-out.log',
      time: true
    }
  ]
};

