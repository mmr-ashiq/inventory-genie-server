import z from 'zod';

export const RegistrationSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'fullName must be a string',
      required_error: 'fullName is required',
    })
    .min(3, {
      message: 'fullName must be at least 3 characters',
    })
    .max(50, {
      message: 'fullName must be at most 50 characters',
    }),
  email: z
    .string({
      invalid_type_error: 'email must be a string',
      required_error: 'email is required',
    })
    .email({
      message: 'Please provide a valid email',
    }),
  permissions: z.array(z.string()).optional().default([]),
  role: z
    .string({
      invalid_type_error: 'role must be a string',
      required_error: 'role is required',
    })
    .default('staff'),
  password: z
    .string({
      invalid_type_error: 'password must be a string',
      required_error: 'password is required',
    })
    .min(8, {
      message: 'password must be at least 8 characters',
    }),
  confirmPassword: z.string({
    invalid_type_error: 'confirmPassword must be a string',
    required_error: 'confirmPassword is required',
  }),
});
