import mongoose from 'mongoose';

const User = {
  findOne: jest.fn(),
  findById: jest.fn(),
};

export default User;
