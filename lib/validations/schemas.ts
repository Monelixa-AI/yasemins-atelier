import { z } from "zod";

// ---------- Reusable patterns ----------

const trPhoneRegex = /^(05\d{9}|5\d{9})$/;

const phoneSchema = z
  .string()
  .regex(trPhoneRegex, "Gecerli bir telefon numarasi giriniz (05XXXXXXXXX)");

const emailSchema = z
  .string()
  .email("Gecerli bir e-posta adresi giriniz");

// ---------- Order ----------

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(100),
        variantId: z.string().optional(),
      })
    )
    .min(1, "Sepet bos olamaz"),
  shippingAddress: z.object({
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmali").max(100),
    phone: phoneSchema,
    address: z.string().min(5, "Adres en az 5 karakter olmali").max(500),
    city: z.string().min(2).max(50),
    district: z.string().min(2).max(50),
    postalCode: z.string().optional(),
  }),
  billingAddress: z
    .object({
      fullName: z.string().min(2).max(100),
      phone: phoneSchema,
      address: z.string().min(5).max(500),
      city: z.string().min(2).max(50),
      district: z.string().min(2).max(50),
      postalCode: z.string().optional(),
      taxNumber: z.string().optional(),
      companyName: z.string().optional(),
    })
    .optional(),
  note: z.string().max(500).optional(),
  discountCode: z.string().max(50).optional(),
  deliveryDate: z.string().optional(),
  deliveryTimeSlot: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// ---------- Auth ----------

export const RegisterSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmali").max(80),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Sifre en az 8 karakter olmali")
    .max(128, "Sifre en fazla 128 karakter olabilir"),
  phone: phoneSchema.optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Sifre gerekli").max(128),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ---------- Booking ----------

export const CreateBookingSchema = z.object({
  serviceId: z.string().min(1, "Hizmet secimi gerekli"),
  date: z.string().min(1, "Tarih secimi gerekli"),
  timeSlot: z.string().min(1, "Saat secimi gerekli"),
  guestCount: z.number().int().min(1).max(50).optional(),
  name: z.string().min(2, "Ad en az 2 karakter olmali").max(100),
  email: emailSchema,
  phone: phoneSchema,
  note: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

// ---------- Review ----------

export const CreateReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .min(10, "Yorum en az 10 karakter olmali")
    .max(1000, "Yorum en fazla 1000 karakter olabilir"),
  title: z.string().max(100).optional(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

// ---------- Contact ----------

export const ContactSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmali").max(100),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(3, "Konu en az 3 karakter olmali").max(200),
  message: z
    .string()
    .min(10, "Mesaj en az 10 karakter olmali")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir"),
});

export type ContactInput = z.infer<typeof ContactSchema>;

// ---------- Validation helper ----------

type ValidationSuccess<T> = { data: T; error?: never };
type ValidationError = { data?: never; error: string };

/**
 * Validate a request body against a Zod schema.
 * Returns `{ data }` on success, `{ error }` on failure.
 */
export function validateBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): ValidationSuccess<T> | ValidationError {
  const result = schema.safeParse(body);
  if (result.success) {
    return { data: result.data };
  }

  // Collect all error messages
  const messages = result.error.issues.map((issue) => issue.message);
  return { error: messages.join(", ") };
}
