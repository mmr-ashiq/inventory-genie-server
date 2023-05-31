import { z } from 'zod';

export const addNewCustomerSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required',
  }),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Email must be a valid email address',
    })
    .optional(),
  phone: z.string({
    invalid_type_error: 'Phone must be a string',
    required_error: 'Phone is required',
  }),
  address: z.string({
    invalid_type_error: 'Address must be a string',
  }),
});

export const updateCustomerSchema = addNewCustomerSchema;
