import { Request, Response } from 'express';
import mongoose from 'mongoose'; // For ObjectId
import Event from '../../src/models/event';
import redisClient from '../../src/redis';
import { createEvent, applyToEvent, updateEvent, deleteEvent, getEvent, getAllEvents, accessEventWithQRCode } from '../../src/controllers/event.controller';

// Mock Event and Redis
jest.mock('../../src/redis');
jest.mock('../../src/models/event');

describe('Event Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockEventId = new mongoose.Types.ObjectId();
  const mockEvent = {
    _id: mockEventId,
    title: 'Sample Event',
    description: 'Description of the event',
    date: new Date(),
    location: 'Event Location',
    creator: new mongoose.Types.ObjectId(),
    slug: 'sample-event-slug',
    reminderDaysBefore: 1,
    attendees: [],
    ticketsSold: 0,
    qrCodesScanned: 0,
    save: jest.fn().mockResolvedValue({ ...mockEvent }),
  };

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should create an event', async () => {
    req.body = {
      title: 'Sample Event',
      description: 'Description of the event',
      date: new Date(),
      location: 'Event Location',
      reminderDaysBefore: 1,
    };
    req.user = { id: 'creatorId' };

    (Event.prototype.save as jest.Mock).mockResolvedValue(mockEvent);
    (redisClient.del as jest.Mock).mockResolvedValue('OK');

    await createEvent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event created successfully',
      event: mockEvent,
      shareableUrl: `http://localhost:${process.env.PORT}/events/${mockEvent.slug}`,
    });
  });

  it('should apply to an event', async () => {
    req.body = { eventId: mockEventId, userId: 'userId' };
    req.user = { id: 'userId' };
    req.event = mockEvent;

    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (Event.findById as jest.Mock).mockResolvedValue(mockEvent);
    (Event.prototype.save as jest.Mock).mockResolvedValue(mockEvent);
    (redisClient.set as jest.Mock).mockResolvedValue('OK');

    await applyToEvent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEvent);
  });

  it('should update an event', async () => {
    req.params = { eventId: mockEventId.toString() };
    req.body = { title: 'Updated Event Title' };

    (Event.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockEvent);
    (redisClient.setEx as jest.Mock).mockResolvedValue('OK');
    (redisClient.del as jest.Mock).mockResolvedValue('OK');

    await updateEvent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEvent);
  });

  it('should delete an event', async () => {
    req.params = { eventId: mockEventId.toString() };

    (Event.findByIdAndDelete as jest.Mock).mockResolvedValue(mockEvent);
    (redisClient.del as jest.Mock).mockResolvedValue('OK');

    await deleteEvent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event deleted' });
  });

  it('should get an event', async () => {
    req.params = { eventId: mockEventId.toString() };

    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockEvent));
    (Event.findById as jest.Mock).mockResolvedValue(mockEvent);

    await getEvent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEvent);
  });

  it('should get all events', async () => {
    const mockEvents = [mockEvent];
    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockEvents));
    (Event.find as jest.Mock).mockResolvedValue(mockEvents);

    await getAllEvents(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEvents);
  });

  it('should access event with QR code', async () => {
    req.body = { eventId: mockEventId };
    req.ticket = { event: mockEventId.toString() };

    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockEvent));
    (Event.findById as jest.Mock).mockResolvedValue(mockEvent);

    await accessEventWithQRCode(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access granted', event: mockEvent });
  });
});
