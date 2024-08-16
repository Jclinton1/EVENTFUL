import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  creator: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  ticketsSold: number;
  slug?: string;
  reminderDaysBefore?: number
  qrCodesScanned: number;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  attendees: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  ticketsSold: { type: Number, default: 0 },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  reminderDaysBefore: { type: Number, default: 1 },
  qrCodesScanned: { type: Number, default: 0 }
});

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
