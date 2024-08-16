import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  location: Joi.string().required(),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  location: Joi.string().optional(),
});
