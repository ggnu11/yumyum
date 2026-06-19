import i18n from '@/i18n';

type UserInfomation = {
  email: string;
  password: string;
};

function validateUser(values: UserInfomation) {
  const errors = {
    email: '',
    password: '',
  };

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = i18n.t('validation.invalidEmail');
  }
  if (
    values.password.trim() &&
    (values.password.length < 8 || values.password.length > 20)
  ) {
    errors.password = i18n.t('validation.passwordLength');
  }

  return errors;
}

function validateLogin(values: UserInfomation) {
  return validateUser(values);
}

function validateSignup(values: UserInfomation & {passwordConfirm: string}) {
  const errors = validateUser(values);
  const signupErrors = {...errors, passwordConfirm: ''};

  if (values.password !== values.passwordConfirm) {
    signupErrors.passwordConfirm = i18n.t('validation.passwordMismatch');
  }

  return signupErrors;
}

function validateAddPost(values: {title: string}) {
  const errors = {
    title: '',
    description: '',
    date: '',
    color: '',
    score: '',
  };

  if (values.title.trim() === '') {
    errors.title = i18n.t('validation.titleRequired');
  }

  return errors;
}

function validateEditProfile(values: {nickname: string}) {
  const errors = {
    nickname: '',
  };
  if (values.nickname.trim() === '') {
    errors.nickname = i18n.t('validation.nicknameRequired');
  }

  return errors;
}

export {validateAddPost, validateEditProfile, validateLogin, validateSignup};
