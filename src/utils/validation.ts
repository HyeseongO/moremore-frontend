export interface ValidationError {
  email: string[];
  password: string[];
  isValid: boolean;
}

export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];

  if (!email || email.trim() === '') {
    errors.push('이메일을 입력해주세요!');
    return errors;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('올바른 이메일 형식이 아닙니다.');
    return errors;
  }

  if (email.length > 50) {
    errors.push('이메일 길이가 너무 깁니다.');
    return errors;
  }

  return errors;
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (!password || password.trim() === '') {
    errors.push('비밀번호를 입력해주세요!');
    return errors;
  }

  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }

  if (password.length > 50) {
    errors.push('비밀번호가 너무 깁니다.');
  }

  return errors;
};

export const validateLoginForm = (
  email: string,
  password: string
): ValidationError => {
  const errors: ValidationError = {
    email: validateEmail(email),
    password: validatePassword(password),
    isValid: false,
  };
  errors.isValid = errors.email.length === 0 && errors.password.length === 0;

  return errors;
};
