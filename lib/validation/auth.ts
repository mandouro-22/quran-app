import z, { ZodObject, ZodRawShape } from "zod";
import { sanitizeField } from "../format/sanitize-fields";

const baseAuthFields = z.object({
  email: z
    .email({
      pattern: z.regexes.email,
      error: "قم بادخال البريد الكتروني بطريقه صحيحه",
    })
    .trim()
    .transform(sanitizeField)
    .refine((value) => value !== "", {
      error: "هذا الحقل مطلوب",
    })
    .transform(sanitizeField),
  password: z
    .string()
    .min(8, "يجب ان يكون ع الاقل 8 ارقام")
    .max(256, "انت تعديت الحد المسموح لك")
    .trim()
    .transform(sanitizeField)
    .refine((value) => value !== "", {
      error: "هذا الحقل مطلوب",
    }),
});

const withPassMatcher = <T extends ZodObject<ZodRawShape>>(schema: T): T =>
  schema.refine((data) => data.password === data.confirmPassword, {
    error: "كلمات المرور غير متطابقه",
    path: ["confirmPassword"],
  });

export const loginSchema = baseAuthFields;
export const registerSchema = withPassMatcher(
  baseAuthFields.extend({
    name: z
      .string("هذا الحقل مطلوب")
      .min(4, "يجب ان يكون ع الاقل 4 احرف")
      .trim()
      .transform(sanitizeField)
      .refine((value) => value !== "", { error: "هذا الحقل مطلوب" }),
    confirmPassword: z.string().trim().transform(sanitizeField),
  })
);

export type typeLoginSchema = z.infer<typeof loginSchema>;
export type typeRegisterSchema = z.infer<typeof registerSchema>;
