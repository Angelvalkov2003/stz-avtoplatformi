import { z } from "zod";

const bgPhone = /^(?:\+359|0)(?:87|88|89|98|99|2|[3-9]\d)\d{6,7}$/;

/** Postgres uuid shape (incl. seed ids); not restricted to RFC variant bits. */
const uuidLike = z
  .string()
  .trim()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Невалиден идентификатор на платформа.",
  );

const pickupTime = z
  .string()
  .regex(/^([01]\d|2[0-3]):00$/, "Изберете час на вземане.")
  .refine((t) => {
    const h = Number(t.slice(0, 2));
    return h >= 8 && h <= 18;
  }, "Часът трябва да е между 08:00 и 18:00.");

export const bookingFormSchema = z.object({
  platformId: uuidLike,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickupTime,
  customerName: z.string().trim().min(2, "Въведете име.").max(120),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s\-()]/g, ""))
    .refine((v) => bgPhone.test(v), "Въведете валиден български телефон."),
  email: z.string().trim().email("Въведете валиден имейл."),
  travelScope: z.enum(["bulgaria", "abroad"], {
    message: "Изберете къде ще пътувате.",
  }),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "Трябва да приемете общите условия.",
  }),
  website: z.string().max(0).optional(),
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

export const adminManualSchema = z.object({
  platformId: uuidLike,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["pending", "confirmed", "blocked"]),
  customerName: z.string().trim().max(120).default(""),
  phone: z.string().trim().max(40).default(""),
  email: z.string().trim().email().optional().or(z.literal("")),
  cargo: z.string().trim().max(300).optional().or(z.literal("")),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
});
