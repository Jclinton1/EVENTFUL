import mongoose, { Document, Schema, SchemaType } from 'mongoose';

export interface ITicket extends Document {
    qrCode: string;
    event: mongoose.Types.ObjectId;
    user: Schema.Types.ObjectId;
    isValid: boolean;
}

const TicketSchema: Schema = new Schema({
    qrCode: { type: String, required: true, unique: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isValid: { type: Boolean, default: true },
});

const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
export default Ticket;

