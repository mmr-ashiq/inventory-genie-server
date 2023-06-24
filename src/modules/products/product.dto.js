import { z } from 'zod';

export const addNewProductSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required',
  }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
      required_error: 'Description is required',
    })
    .optional(),
  price: z.coerce
    .number({
      invalid_type_error: 'Price must be a number',
      required_error: 'Price is required',
    })
    .min(1, 'Price must be greater than 0')
    .refine((value) => !(value % 1), 'Price must be an integer')
    .optional(),
  category: z.array(
    z.string({
      invalid_type_error: 'Category must be a string or an array of strings',
      required_error: 'Category is required',
    })
  ),
  variants: z
    .array(
      z.string({
        invalid_type_error: 'Variants must be a string',
        required_error: 'Variants is required',
      })
    )
    .optional(),
  discount: z.coerce
    .number({
      invalid_type_error: 'Discount must be a number',
      required_error: 'Discount is required',
    })
    .optional(),
  company: z
    .string({
      invalid_type_error: 'Company must be a string',
      required_error: 'Company is required',
    })
    .optional(),
  stock: z
    .number({
      invalid_type_error: 'Stock must be a number',
      required_error: 'Stock is required',
    })
    .min(0, 'Stock cannot be negative')
    .optional(),
  // images: z
  //   .array(
  //     z.object({
  //       path: z.string({
  //         invalid_type_error: 'Path must be a string',
  //         required_error: 'Path is required',
  //       }),
  //     })
  //   )
  //   .optional(),
});

export const updateProductSchema = addNewProductSchema;

export const productStockInSchema = z.object({
  vendorId: z.string({
    invalid_type_error: 'Vendor Id must be a string',
    required_error: 'Vendor Id is required',
  }),
  productId: z.string({
    invalid_type_error: 'Product Id must be a string',
    required_error: 'Product Id is required',
  }),
  quantity: z
    .number({
      invalid_type_error: 'Quantity must be a number',
      required_error: 'Quantity is required',
    })
    .min(1, 'Quantity must be greater than 0'),
  totalPrice: z.coerce
    .number({
      invalid_type_error: 'Total Price must be a number',
      required_error: 'Total Price is required',
    })
    .min(1, 'Total Price must be greater than 0'),
  paidPrice: z.coerce.number({
    invalid_type_error: 'Paid Price must be a number',
    required_error: 'Paid Price is required',
  }),
});

export const productSellSchema = z.object({
  customerId: z.string({
    invalid_type_error: 'Customer Id must be a string',
    required_error: 'Customer Id is required',
  }),
  products: z.array(
    z.object({
      productId: z.string({
        invalid_type_error: 'Product Id must be a string',
        required_error: 'Product Id is required',
      }),
      quantity: z.coerce.number({
        invalid_type_error: 'Quantity must be a number',
        required_error: 'Quantity is required',
      }),
    })
  ),
  paidPrice: z.coerce.number({
    invalid_type_error: 'Total Price must be a number',
    required_error: 'Total Price is required',
  }),
});
