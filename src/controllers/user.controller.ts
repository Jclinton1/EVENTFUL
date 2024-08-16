import { Request, Response } from "express";
import User, { IUser } from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: IUser | null = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const setReminder = async (req: Request, res: Response) => {
  try {
      const { eventId, reminderDaysBefore } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Check if reminder for this event already exists
      const existingReminder = user.reminders.events.find(r => r.eventId.toString() === eventId);
      if (existingReminder) {
          existingReminder.reminderDaysBefore = reminderDaysBefore;
      } else {
          user.reminders.events.push({ eventId, reminderDaysBefore });
      }

      await user.save();

      res.status(200).json({ message: 'Reminder set successfully' });
  } catch (err: any) {
      res.status(400).json({ error: err.message });
  }
};
