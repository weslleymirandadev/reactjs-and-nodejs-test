import { describe, it, expect, beforeAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let token: string;
    let randomEmail: string;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        randomEmail = `user${Date.now()}@e2e.com`;

        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: randomEmail, password: '123456', username: 'user' });

        const res = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({ email: randomEmail, password: '123456' });

        token = res.body.access_token;
    });

    it('/users/me (GET) should return user info', async () => {
        const res = await request(app.getHttpServer())
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe(randomEmail);
    });
});