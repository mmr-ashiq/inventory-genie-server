const { z } = require('zod');

const addProductSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Please enter product name',
      required_error: 'Please enter product name',
    })
    .min(1, {
      message: 'Product name cannot be less than 1 character',
    })
    .max(100, {
      message: 'Product name cannot exceed 100 characters',
    }),
  company: z
    .string({
      invalid_type_error: 'company name must be a string',
    })
    .min(1, {
      message: 'Company name cannot be less than 1 character',
    })
    .max(50, {
      message: 'Company name cannot exceed 50 characters',
    })
    .nullable()
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Product description must be a string',
      required_error: 'Please enter product description',
    })
    .min(1, {
      message: 'Product description cannot be less than 1 character',
    })
    .max(2000, {
      message: 'Product description cannot exceed 2000 characters',
    }),
  variants: z.array(z.string()).optional(),
  price: z.coerce
    .number({
      invalid_type_error: 'Product price must be a number',
      required_error: 'Please enter product price',
    })
    .min(0, {
      message: 'Product price cannot be less than 0',
    })
    .max(1000000000, {
      message: 'Product price cannot exceed 1000000000',
    }),
  discount: z.coerce
    .number({
      invalid_type_error: 'Product discount must be a number',
    })
    .min(0, {
      message: 'Product discount cannot be less than 0',
    })
    .max(90, {
      message: 'Product discount cannot exceed 90',
    })
    .optional(),
  stock: z.coerce
    .number({
      invalid_type_error: 'Product stock must be a number',
      required_error: 'Please enter product stock',
    })
    .min(0, {
      message: 'Product stock cannot be less than 0',
    })
    .max(1000000000, {
      message: 'Product stock cannot exceed 1000000000',
    }),
});

const updateProductSchema = z.object({});

module.exports = {
  addProductSchema,
};