module.exports = {
  apps: [
    {
      name: "sifmo-backend",
      script: "server.js",
      cwd: "../SIFMO_backend",
      watch: false,
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "sifmo-frontend",
      script: "node_modules/vite/bin/vite.js",
      cwd: ".",
      watch: false
    }
  ]
};
