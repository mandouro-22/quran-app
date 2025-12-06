// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function translateSupabaseError(error: any): string | null {
  if (!error) return null;

  switch (error?.code) {
    // Auth errors
    case "invalid_credentials":
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    case "email_not_confirmed":
      return "يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول";
    case "user_not_found":
      return "المستخدم غير موجود";
    case "weak_password":
      return "كلمة المرور ضعيفة جدًا";
    case "over_email_send_rate_limit":
      return "لقد تجاوزت الحد المسموح لإرسال رسائل البريد الإلكتروني، حاول لاحقًا";
    case "signup_disabled":
      return "التسجيل غير متاح حاليًا";
    case "provider_already_linked":
      return "هذا الحساب مرتبط بالفعل بمزود آخر";
    case "valid_gmail_only":
      return "الإيميل لازم يكون Gmail فقط";

    // Database errors
    case "PGRST301":
      return "المورد المطلوب غير موجود";
    case "PGRST302":
      return "غير مصرح لك بالوصول إلى هذا المورد";
    case "PGRST303":
      return "الطلب غير صحيح أو البيانات غير مكتملة";

    // Storage errors
    case "bucket_not_found":
      return "المجلد المطلوب غير موجود";
    case "duplicate_file":
      return "الملف موجود بالفعل";
    case "file_not_found":
      return "الملف غير موجود";

    // Network / generic
    case "ECONNREFUSED":
      return "تعذر الاتصال بالخادم";
    case "ETIMEDOUT":
      return "انتهت مهلة الاتصال بالخادم";

    default:
      return error?.message ?? "حدث خطأ غير متوقع، حاول مرة أخرى";
  }
}
