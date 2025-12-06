import DOMPurify from "dompurify";
export const sanitizeField = (value: string) => {
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
};
