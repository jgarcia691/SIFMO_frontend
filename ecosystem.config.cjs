module.exports = {
  apps: [
    {
      name: "sifmo-backend",
      script: "server.js",
      cwd: "../SIFMO_backend", // Sube un nivel desde frontend y entra a backend
      watch: false,
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "sifmo-frontend",
      script: "npm",           //En Windows, llamamos a npm para evitar errores con Vite
      args: "run dev",         // O 'run start' según tengas configurado tu package.json
      cwd: ".",                // Se ejecuta en la raíz del frontend
      watch: false
    }
  ]
};
