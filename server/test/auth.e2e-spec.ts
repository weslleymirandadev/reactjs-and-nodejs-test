import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { describe, it, expect, beforeAll } from 'vitest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let randomEmail: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    randomEmail = `test${Date.now()}@e2e.com`;
  });

  it('/auth/signup (POST) should create user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: randomEmail, password: '123456', username: 'test' });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
  });

  it('/auth/signup (POST) should fail for duplicate email', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: randomEmail, password: '123456', username: 'test' });
    expect(res.status).toBe(409); // Conflict
  });

  it('/auth/signin (POST) should login', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: randomEmail, password: '123456' });
    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
  });

  it('/auth/signin (POST) should fail with wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: randomEmail, password: 'wrongpass' });
    expect(res.status).toBe(403);
  });
}); 