const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}\[\]|:;"'<>,.?/]).{8,16}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserFields({ name, email, address, password }) {
  const errors = [];

  if (!name || name.length < 20 || name.length > 60) {
    errors.push('Name must be between 20 and 60 characters.');
  }
  if (!address || address.length > 400) {
    errors.push('Address is required and must be at most 400 characters.');
  }
  if (!email || !emailRegex.test(email)) {
    errors.push('Invalid email address.');
  }
  if (password !== undefined) {
    if (!passwordRegex.test(password)) {
      errors.push('Password must be 8-16 chars, include at least one uppercase and one special character.');
    }
  }

  return errors;
}