function isPasswordStrong(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);


  // I'll not use it for now
  // const hasSpecialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (password.length < minLength) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }

  if (!hasUppercase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }

  if (!hasLowercase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }

  if (!hasNumber) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }

  return { isValid: true, message: 'Password is strong' }
}

module.exports = { isPasswordStrong };