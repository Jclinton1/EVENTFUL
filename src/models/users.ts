import mongoose, { Document, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(password: string): Promise<boolean>;
  reminders: {
    events: { eventId: string, reminderDaysBefore: number }[];
  }
  ticketsPurchased: Schema.Types.ObjectId[];
  qrCodesScanned: Schema.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["creator", "eventee"], default: "eventee" },
  reminders: {
    events: [
        {
            eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
            reminderDaysBefore: { type: Number, default: 1 }
        }
    ]
},
qrCodesScanned: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema)

export default User;
