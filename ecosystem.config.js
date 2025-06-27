const isWindows = process.platform === "win32";

module.exports = {
  apps: [
    {
      name: "client",
      cwd: "./client",
      script: isWindows ? "cmd" : "pnpm",
      args: isWindows ? "/c pnpm start" : "start",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "server",
      cwd: "./server",
      script: isWindows ? "cmd" : "pnpm",
      args: isWindows ? "/c pnpm run start" : "run start",
      env: {
        NODE_ENV: "production",
        PORT: 8080
      }
    }
  ]
};
