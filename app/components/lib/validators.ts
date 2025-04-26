export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
  
export const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[\W_]/.test(password);
};
  