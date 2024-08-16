import { Request, Response } from "express";
import { generateQRCode } from "../utils/qrGenerator";
import Ticket from "../models/tickets";

export const purchaseTicket = async (req: Request, res: Response) => {
  try {
    const { eventId, userId } = req.body;

    // Assume you have a function to create a ticket
    const ticket = await Ticket.create({
      event: eventId,
      user: userId,
      // Other ticket details
    });

    // Generate QR code for the ticket
    const qrCodeText = `TicketID:${ticket._id}`;
    const qrCodeDataUrl = await generateQRCode(qrCodeText);

    // Save QR code URL to the ticket
    ticket.qrCode = qrCodeDataUrl;
    await ticket.save();

    res.status(201).json({
      message: "Ticket purchased successfully",
      ticket,
      qrCode: qrCodeDataUrl,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
