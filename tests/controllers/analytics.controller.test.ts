import { Request, Response } from 'express';
import { getEventAnalytics, getCreatorAnalytics } from '../controllers/analytics.controller';
import Event, { IEvent } from '../src/models/event';

jest.mock('../models/event');

describe('Analytics Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should get event analytics', async () => {
    req.params = { eventId: 'eventId' };

    (Event.findById as jest.Mock).mockResolvedValue({ _id: 'eventId', title: 'Test Event', ticketsSold: 10, attendees: [1, 2, 3], qrCodesScanned: 5 } as IEvent);

    await getEventAnalytics(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Test Event',
      totalTicketsSold: 10,
      totalAttendees: 3,
      totalQrCodesScanned: 5
    });
  });

  it('should get creator analytics', async () => {
    req.params = { creatorId: 'creatorId' };

    (Event.find as jest.Mock).mockResolvedValue([
      { ticketsSold: 10, attendees: [1, 2], qrCodesScanned: 5 } as IEvent,
      { ticketsSold: 20, attendees: [1, 2, 3], qrCodesScanned: 15 } as IEvent
    ]);

    await getCreatorAnalytics(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({
      totalTicketsSold: 30,
      totalAttendees: 5,
      totalQrCodesScanned: 20
    });
  });
});
