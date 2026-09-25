import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  category: z.enum(['serums', 'skin', 'hair', 'tools']),
  price: z.number().positive().max(10000),
  bulkPrice: z.number().positive().optional().nullable(),
  bulkQty: z.number().int().positive().optional().nullable(),
  stock: z.boolean(),
  badge: z.string().max(50).optional().nullable(),
  description: z.string().max(5000).optional().default(''),
  media: z
    .array(z.object({ type: z.enum(['image', 'video']), url: z.string().url() }))
    .optional()
    .default([]),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(50).regex(/^[A-Z0-9]+$/, 'Uppercase letters and numbers only'),
  active: z.boolean().default(true),
  percentOff: z.number().min(0).max(100).optional().nullable(),
  dollarOff: z.number().positive().max(1000).optional().nullable(),
  firstOrderOnly: z.boolean().default(false),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  // Strips out spaces, brackets, and dashes before validating length
  phone: z
    .string()
    .transform((val) => val.replace(/[\s\-\(\)]/g, ''))
    .pipe(z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number')),
  address: z.string().min(5, 'Address is too short').max(500).trim(),
  // Accepts either the internal keys or full UI labels
  paymentMethod: z.enum([
    'cash',
    'wishpay',
    'cod',
    'whish',
    'Cash on Delivery',
    'Cash on Delivery (USD / LBP)',
    'Whish Money',
    'Whish Money Transfer',
  ]),
});

export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}