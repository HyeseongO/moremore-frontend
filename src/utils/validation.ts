const SPECIAL_CHARS = '!-\\/:-@\\[-`{-~';
const SPECIAL_CHAR = new RegExp(`[${SPECIAL_CHARS}]`);
const NICKNAME_CHARS = new RegExp(`^[A-Za-z0-9가-힣${SPECIAL_CHARS}]+$`);
const PASSWORD_CHARS = new RegExp(`^[A-Za-z0-9${SPECIAL_CHARS}]*$`);

export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];

  if (!email || email.trim() === '') {
    errors.push('validation.email.required');
    return errors;
  }

  if (email.includes(' ')) {
    errors.push('validation.email.noSpaces');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('validation.email.invalid');
  }

  if (email.length > 50) {
    errors.push('validation.email.tooLong');
  }

  return errors;
};

export const validateNickname = (nickname: string): string[] => {
  const errors: string[] = [];

  if (!nickname || nickname.trim().length === 0) {
    errors.push('validation.nickname.required');
    return errors;
  }

  if (nickname.length < 2 || nickname.length > 20) {
    errors.push('validation.nickname.length');
  }

  if (nickname.includes(' ')) {
    errors.push('validation.nickname.noSpaces');
  }

  if (!/^[A-Za-z0-9가-힣]/.test(nickname)) {
    errors.push('validation.nickname.startsWithSpecial');
  }

  if (!NICKNAME_CHARS.test(nickname)) {
    errors.push('validation.nickname.invalidChars');
  }

  return errors;
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (!password || password.trim() === '') {
    errors.push('validation.password.required');
    return errors;
  }

  if (password.includes(' ')) {
    errors.push('validation.password.noSpaces');
  }

  if (password.length < 8 || password.length > 20) {
    errors.push('validation.password.length');
  }

  if (!PASSWORD_CHARS.test(password.replace(/ /g, ''))) {
    errors.push('validation.password.invalidChars');
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = SPECIAL_CHAR.test(password);

  if (!hasLetter) {
    errors.push('validation.password.needsLetter');
  }

  if (!hasNumber) {
    errors.push('validation.password.needsNumber');
  }

  if (!hasSpecialChar) {
    errors.push('validation.password.needsSpecial');
  }

  return errors;
};
