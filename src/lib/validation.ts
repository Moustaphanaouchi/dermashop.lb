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
  customerName: z.string().min(2).max(100).trim(),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number'),
  address: z.string().min(8).max(500).trim(),
  paymentMethod: z.enum(['cash', 'wishpay']),
});

export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}