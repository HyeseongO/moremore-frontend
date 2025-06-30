export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];

  if (!email || email.trim() === '') {
    errors.push('이메일을 입력해주세요!');
    return errors;
  }

  if (email.includes(' ')) {
    errors.push('이메일에 공백을 포함할 수 없습니다.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('올바른 이메일 형식이 아닙니다.');
  }

  if (email.length > 50) {
    errors.push('이메일 길이가 너무 깁니다.');
  }

  return errors;
};

export const validateNickname = (nickname: string): string[] => {
  const errors: string[] = [];

  if (!nickname || nickname.trim().length === 0) {
    errors.push('닉네임을 입력해주세요!');
    return errors;
  }

  if (nickname.length < 2 || nickname.length > 20) {
    errors.push('닉네임은 최소 2자 이상 최대 20자 이하여야 합니다!');
  }

  if (nickname.includes(' ')) {
    errors.push('닉네임에 공백을 포함할 수 없습니다!');
  }

  if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(nickname)) {
    errors.push('닉네임은 특수문자로 시작할 수 없습니다!');
  }

  const nicknameRegex =
    /^[가-힣a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/;
  if (!nicknameRegex.test(nickname)) {
    errors.push('닉네임은 한글, 영어, 숫자, 특수문자만 사용 가능합니다!');
  }

  return errors;
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (!password || password.trim() === '') {
    errors.push('비밀번호를 입력해주세요!');
    return errors;
  }

  if (password.includes(' ')) {
    errors.push('비밀번호에 공백을 포함할 수 없습니다!');
  }

  if (password.length < 8 || password.length > 20) {
    errors.push('비밀번호는 최소 8자 이상 최대 20자 이하여야 합니다!');
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/';]/.test(
    password
  );

  if (!hasLetter) {
    errors.push('비밀번호에는 최소 1개의 영문자가 포함되어야 합니다!');
  }

  if (!hasNumber) {
    errors.push('비밀번호에는 최소 1개의 숫자가 포함되어야 합니다!');
  }

  if (!hasSpecialChar) {
    errors.push('비밀번호에는 최소 1개의 특수문자가 포함되어야 합니다!');
  }

  return errors;
};
