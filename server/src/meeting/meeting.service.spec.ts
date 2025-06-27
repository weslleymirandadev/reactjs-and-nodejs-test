import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MeetingService } from './meeting.service';

describe('MeetingService', () => {
  let service: MeetingService;
  let prisma: any;

  beforeEach(async () => {
    // Mock dependencies
    prisma = {
      meeting: { findUnique: vi.fn(), create: vi.fn() },
      meetingParticipant: { create: vi.fn() }
    };
    service = new MeetingService(prisma as any);
  });

  it('should throw if meeting not found on joinMeeting', async () => {
    prisma.meeting.findUnique.mockResolvedValue(null);
    await expect(service.joinMeeting('id', 'user', 'wallet')).rejects.toThrow();
  });
}); 