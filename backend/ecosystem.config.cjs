module.exports = {
  apps: [
    {
      name: 'gestion-empleados-api',
      script: './node_modules/tsx/dist/cli.mjs',
      args: 'src/index.ts',
      instances: 'max',
      exec_mode: 'cluster',

      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },

      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: '3.151.244.205',

      key: '/home/mcadme/.ssh/claveServer.pem',

      ref: 'origin/reto-3',

      repo: 'https://github.com/mecadme/practica03_MERN.git',

      path: '/var/www/empleados-deploy',

      'post-deploy':
        'cd backend && mkdir -p logs && npm install && pm2 startOrReload ecosystem.config.cjs --env production && pm2 save'
    }
  }
};