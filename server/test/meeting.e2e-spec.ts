import { describe, it, expect, beforeAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('MeetingController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let meetingId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const email = `meeting${Date.now()}@e2e.com`;
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456', username: 'meeting' });

    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: '123456' });

    token = res.body.access_token;
  });

  it('/meetings (GET) should return meetings', async () => {
    const res = await request(app.getHttpServer())
      .get('/meetings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/meetings (POST) should create meeting', async () => {
    const res = await request(app.getHttpServer())
      .post('/meetings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Meeting',
        description: 'A test meeting',
        date: new Date().toISOString(),
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    meetingId = res.body.id;
  });

  it('/meetings/:id/join (POST) should join meeting', async () => {
    const res = await request(app.getHttpServer())
      .post(`/meetings/${meetingId}/join`)
      .set('Authorization', `Bearer ${token}`)
      .send({ walletAddress: '0x123' });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
  });

  it('/meetings/:id/leave (DELETE) should leave meeting', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/meetings/${meetingId}/leave`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
}); 