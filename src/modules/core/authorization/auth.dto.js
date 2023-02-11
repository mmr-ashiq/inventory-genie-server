const { z } = require("zod");

exports.RegistrationSchema = z.object({
  userName: z
    .string({
      required_error: "userName is required",
      invalid_type_error: "userName must be a string",
    })
    .min(3)
    .max(40)
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "userName can only contain letters and numbers",
    }),
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email must be a string",
    })
    .email(),
  fullName: z
    .string({
      required_error: "fullName is required",
      invalid_type_error: "fullName must be a string",
    })
    .min(3)
    .max(50),
  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password must be a string",
    })
    .min(8, {
      message: "password must be at least 8 characters",
    })
    .max(40),
  confirmPassword: z.string({
    required_error: "confirmPassword is required",
    invalid_type_error: "confirmPassword must be a string",
  }),
  Permissions: z.array(z.string()).optional(),
});