import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validateBody = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error: any) {
      next({
        message: error.details[0].message,
        status: 400,
      });
    }
  };
};
