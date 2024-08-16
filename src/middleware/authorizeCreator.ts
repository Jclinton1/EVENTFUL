import { Request, Response, NextFunction } from "express";
import Event from "../models/event";

export const authorizeCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
