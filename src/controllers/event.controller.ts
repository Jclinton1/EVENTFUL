import { Request, Response } from "express";
import Event, { IEvent } from "../models/event";
import { QRRequest } from "../middleware/validateQrCode";
import redisClient from '../redis';

const CACHE_EXPIRATION = 3600; // 1 hour


// Create event
export const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }
    const { title, description, date, location, reminderDaysBefore } = req.body;

    // Generate a unique slug for shareable URL
    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    const event: IEvent = new Event({
      title,
      description,
      date,
      location,
      creator: req.user?.id,
      slug,
      reminderDaysBefore
    });

    await event.save();

    // Clear the cache for events
    await redisClient.del('events');

    res
      .status(201)
      .json({
        message: "Event created successfully",
        event,
        shareableUrl: `http://localhost:${process.env.PORT}/events/${slug}`,
      });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Apply to attend event
export const applyToEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.event?._id as string;

    // Check cache for the event
    const cachedEvent = await redisClient.get(`event:${eventId}`);
    let event: IEvent;

    if (cachedEvent) {
      event = JSON.parse(cachedEvent) as IEvent;
    } else {
      // If not found in cache, query the database
      event = await Event.findById(eventId) as IEvent;
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Cache the event details
      await redisClient.set(`event:${eventId}`, JSON.stringify(event), { EX: 3600 }); // Cache for 1 hour
    }

    if (event.attendees.includes(req.user?.id)) {
      return res
        .status(400)
        .json({ error: "You are already attending this event" });
    }

    event.attendees.push(req.user?.id);
    await event.save();

    // Update the cache with the new event data
    await redisClient.set(`event:${eventId}`, JSON.stringify(event), { EX: 3600 });

    res.status(200).json(event);
  } catch (err: any) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
      const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true }).exec();

      if (!updatedEvent) {
          return res.status(404).json({ error: 'Event not found' });
      }

      // Update the cache
      await redisClient.setEx(`event:${eventId}`, CACHE_EXPIRATION, JSON.stringify(updatedEvent));
      await redisClient.del('events'); // Clear the general events cache

      res.json(updatedEvent);
  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
      const deletedEvent = await Event.findByIdAndDelete(eventId).exec();

      if (!deletedEvent) {
          return res.status(404).json({ error: 'Event not found' });
      }

      // Clear the cache
      await redisClient.del(`event:${eventId}`);
      await redisClient.del('events'); // Clear the general events cache

      res.json({ message: 'Event deleted' });
  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
};

// Get event
export const getEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
      // Check if the event is in the cache
      const cachedEvent = await redisClient.get(`event:${eventId}`);

      if (cachedEvent) {
          return res.json(JSON.parse(cachedEvent));
      }

      // If not in cache, fetch from database
      const event = await Event.findById(eventId).exec();

      if (!event) {
          return res.status(404).json({ error: 'Event not found' });
      }

      // Store the event in the cache
      await redisClient.setEx(`event:${eventId}`, CACHE_EXPIRATION, JSON.stringify(event));

      res.json(event);
  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
      // Check if the events are in the cache
      const cachedEvents = await redisClient.get('events');

      if (cachedEvents) {
          return res.json(JSON.parse(cachedEvents));
      }

      // If not in cache, fetch from database
      const events = await Event.find().exec();

      // Store the events in the cache
      await redisClient.setEx('events', CACHE_EXPIRATION, JSON.stringify(events));

      res.json(events);
  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
};

export const accessEventWithQRCode = async (req: QRRequest, res: Response) => {
  try {
    const { eventId } = req.body;

    // Check cache for the event
    const cachedEvent = await redisClient.get(`event:${eventId}`);
    let event;
    if (cachedEvent) {
      event = JSON.parse(cachedEvent);
    } else {
      // If not found in cache, query the database
      event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Cache the event details
      await redisClient.set(`event:${eventId}`, JSON.stringify(event), { EX: 3600 }); // Cache for 1 hour
    }

    // Check if the ticket attached to the request is for this event
    if (req.ticket?.event.toString() !== eventId) {
      return res.status(401).json({ message: "Invalid ticket for this event" });
    }

    res.status(200).json({ message: "Access granted", event });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};