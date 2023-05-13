import { z } from 'zod';

export const addNewVendorSchema = z.object({
  agentName: z.string({
    invalid_type_error: 'Agent name must be a string',
    required_error: 'Agent name is required',
  }),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required',
    })
    .email({
      message: 'Email must be a valid email address',
    })
    .optional(),
  phone: z.string({
    invalid_type_error: 'Phone must be a string',
    required_error: 'Phone is required',
  }),
});

export const updateVendorSchema = addNewVendorSchema;