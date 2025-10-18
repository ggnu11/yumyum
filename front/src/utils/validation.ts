function validateAddPost(values: {title: string}) {
  const errors = {
    title: '',
    description: '',
    date: '',
    color: '',
    score: '',
  };

  if (values.title.trim() === '') {
    errors.title = '제목은 1~30자 이내로 입력해주세요.';
  }

  return errors;
}

function validateEditProfile(values: {nickname: string}) {
  const errors = {
    nickname: '',
  };
  if (values.nickname.trim() === '') {
    errors.nickname = '닉네임을 입력해주세요.';
  }

  return errors;
}

export {validateAddPost, validateEditProfile};
