# Backend

## Technologies Used

- **Node.js**: Runtime environment for the backend.
- **NestJS**: Framework for building scalable and structured APIs in Node.js.
- **TypeScript**: JavaScript superset that adds static typing to the code.
- **Prisma ORM**: ORM for integration with MongoDB, facilitating data access and manipulation.
- **MongoDB**: NoSQL database used for application data persistence.
- **JWT (JSON Web Token)**: Used for user authentication and authorization.
- **Swagger (OpenAPI)**: Automatic and interactive API documentation.
- **Bcrypt**: Library for password hashing and verification.
- **Vitest**: Unit and e2e testing framework for the backend.
- **Supertest**: Used for HTTP route integration and e2e testing.

## Recomendation

My personal recomendation is using `pnpm` as package manager, since it's way faster than vanilla `npm`.

```sh
npm install -g pnpm@latest
```

## Testing

- **Unit and e2e tests** are implemented using Vitest and Supertest.
- To run all tests:
  ```sh
  pnpm run test
  ```
- To run end-to-end (e2e) tests:
  ```sh
  pnpm run test:e2e
  ```

## Installation and Deployment

1. **Install dependencies and generate Prisma client:**
   ```sh
   pnpm install
   pnpm run install
   ```
2. **Build the project:**
   ```sh
   pnpm run build
   ```
3. **Start the development server:**
   ```sh
   pnpm run start
   ```
4. **Start the production server:**
   ```sh
   pnpm run start:prod
   ```

- The API documentation will be available at `/api` when the server is running.