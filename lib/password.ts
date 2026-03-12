export const passwordRequirements = [
  "At least 10 characters",
  "One uppercase letter",
  "One lowercase letter",
  "One number",
  "One symbol"
];

export function validatePasswordStrength(password: string) {
  const errors: string[] = [];

  if (password.length < 10) {
    errors.push("Password must be at least 10 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must include at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must include at least one number.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must include at least one symbol.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}