// A pragmatic email validator: fast and avoids over-complex RFC regexes.
// Returns true for common valid emails and false for obvious invalid ones.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  if (!value) return false;
  return EMAIL_RE.test(String(value).trim().toLowerCase());
}

export default validateEmail;
