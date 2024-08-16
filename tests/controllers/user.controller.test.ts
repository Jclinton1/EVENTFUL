import { Request, Response } from 'express';
import { registerUser, loginUser, updateUser, setReminder } from '../controllers/user.controller';
import User, { IUser } from '../models/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../models/users');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
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

  it('should register a user', async () => {
    req.body = { name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user' };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
    (User.prototype.save as jest.Mock).mockResolvedValue({ _id: 'userId', ...req.body } as IUser);
    (jwt.sign as jest.Mock).mockReturnValue('token');

    await registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: { _id: 'userId', ...req.body },
      token: 'token'
    });
  });

  it('should login a user', async () => {
    req.body = { email: 'john@example.com', password: 'password' };

    (User.findOne as jest.Mock).mockResolvedValue({ comparePassword: jest.fn().mockResolvedValue(true), _id: 'userId' } as IUser);
    (jwt.sign as jest.Mock).mockReturnValue('token');

    await loginUser(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ token: 'token' });
  });

  it('should update a user', async () => {
    req.body = { name: 'John Doe Updated' };
    req.user = { id: 'userId' };

    (User.findById as jest.Mock).mockResolvedValue({ _id: 'userId', name: 'John Doe' } as IUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
    (User.prototype.save as jest.Mock).mockResolvedValue({ _id: 'userId', ...req.body } as IUser);

    await updateUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ _id: 'userId', ...req.body });
  });

  it('should set reminder', async () => {
    req.body = { eventId: 'eventId', reminderDaysBefore: 1 };
    req.user = { id: 'userId' };

    (User.findById as jest.Mock).mockResolvedValue({ _id: 'userId', reminders: { events: [] } } as IUser);
    (User.prototype.save as jest.Mock).mockResolvedValue({ _id: 'userId', reminders: { events: [{ eventId: 'eventId', reminderDaysBefore: 1 }] } } as IUser);

    await setReminder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Reminder set successfully' });
  });
});
