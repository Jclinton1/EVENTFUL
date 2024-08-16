import { Request, Response } from 'express';
import Event, { IEvent } from '../models/event';

export const getEventAnalytics = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;

        // Fetch event details
        const event = await Event.findById(eventId)
            .populate('creator', 'name email')
            .exec();

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const eventTyped = event.toObject() as IEvent;

        // Prepare analytics data
        const analytics = {
            title: eventTyped.title,
            totalTicketsSold: eventTyped.ticketsSold,
            totalAttendees: eventTyped.attendees.length,
            totalQrCodesScanned: eventTyped.qrCodesScanned
        };

        res.json(analytics);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getCreatorAnalytics = async (req: Request, res: Response) => {
    try {
        const { creatorId } = req.params;

        // Fetch all events created by the creator
        const events = await Event.find({ creator: creatorId })
            .exec();

            const eventsTyped = events.map(event => event.toObject() as IEvent);

        const totalTicketsSold = eventsTyped.reduce((sum, event) => sum + event.ticketsSold, 0);
        const totalAttendees = eventsTyped.reduce((sum, event) => sum + event.attendees.length, 0);
        const totalQrCodesScanned = eventsTyped.reduce((sum, event) => sum + event.qrCodesScanned, 0);

        const analytics = {
            totalTicketsSold,
            totalAttendees,
            totalQrCodesScanned
        };

        res.json(analytics);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
