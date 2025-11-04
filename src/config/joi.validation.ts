import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB_URI: Joi.string().required(),
  PORT: Joi.number().default(3000),
});
