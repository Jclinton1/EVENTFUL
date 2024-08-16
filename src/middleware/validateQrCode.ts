import { Request, Response, NextFunction } from 'express';
import Ticket, { ITicket } from '../models/tickets';
import Event from '../models/event';

export interface QRRequest extends Request {
      ticket?: ITicket;
  }

export const validateQRCode = async (req: QRRequest, res: Response, next: NextFunction) => {
    try {
        const { qrCode } = req.body;

        if (!qrCode) {
            return res.status(400).json({ message: 'QR code is required' });
        }

        // Extract ticket ID from QR code text
        const ticketId = qrCode.split(':')[1];

        // Find the ticket
        const ticket = await Ticket.findById(ticketId);

        if (!ticket || !ticket.isValid) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check if the event associated with the ticket is valid
        const event = await Event.findById(ticket.event);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the ticket is not expired (assuming event date is in the future)
        const currentDate = new Date();
        if (event.date < currentDate) {
            return res.status(400).json({ error: 'Event has already occurred' });
        }

        // Attach the ticket and event to the request object
        req.ticket = ticket;
        req.event = event;

        next();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
