# React.js & Node.js Test

This is a monorepo containing the frontend (client) and backend (server) applications.

- For backend details, see [server/README.md](./server/README.md)
- For frontend details, see [client/README.md](./client/README.md)

## About the project

This project showcases my skills and proficiency as a Full-Stack Engineer, utilizing a robust tech stack to craft an innovative solution.

### How to use the application

After opening the Home page, click on the `Sign Up` button, where you can easily create the administrator account with the following credentials as described in the Test Requirements:
- username: `admin`
- email: `admin@gmail.com`
- password: `admin123`

You are gonna be redirected to the `Sign In` page, where you must put the same credentials again, and then allow your Wallet to connect to the site.
Then you can manage the Meeting feature of the Application.

## Deployment

I strongly recommend using `pnpm` since its faster than `npm` and the setup for the installation and build for this project is way easier with `pnpm`.

1. **Install dependencies for all workspaces:**
   ```sh
   pnpm install
   ```
2. **Build all projects:**
   ```sh
   pnpm run build
   ```
3. **Start all services (using PM2):**
   ```sh
   pnpm run start
   ```
4. **Stop all services:**
   ```sh
   pnpm run stop
   ```

- The backend and frontend have their own documentation and setup instructions in their respective folders.
