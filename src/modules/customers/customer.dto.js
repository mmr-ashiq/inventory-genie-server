import { z } from 'zod';

export const addNewCustomerSchema = z.object({
  firstName: z.string({
    invalid_type_error: 'First Name must be a string',
    required_error: 'First Name is required',
  }),
  lastName: z
    .string({
      invalid_type_error: 'Last Name must be a string',
      required_error: 'Last Name is required',
    })
    .optional(),
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

export const updateCustomerSchema = addNewCustomerSchema;