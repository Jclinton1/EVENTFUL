import { Request, Response } from 'express';
import { purchaseTicket } from '../controllers/ticket.controller';
import Ticket from '../models/tickets';
import { generateQRCode } from '../utils/qrGenerator';

jest.mock('../models/tickets');
jest.mock('../utils/qrGenerator');

describe('Ticket Controller', () => {
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

  it('should purchase a ticket', async () => {
    req.body = { eventId: 'eventId', userId: 'userId' };

    (Ticket.create as jest.Mock).mockResolvedValue({ _id: 'ticketId', qrCode: 'qrCodeUrl' });
    (generateQRCode as jest.Mock).mockResolvedValue('qrCodeUrl');
    (Ticket.prototype.save as jest.Mock).mockResolvedValue({ _id: 'ticketId', qrCode: 'qrCodeUrl' });

    await purchaseTicket(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Ticket purchased successfully',
      ticket: { _id: 'ticketId', qrCode: 'qrCodeUrl' },
      qrCode: 'qrCodeUrl'
    });
  });
});
