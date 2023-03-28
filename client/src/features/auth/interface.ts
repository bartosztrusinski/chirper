interface LogInData {
  login: string;
  password: string;
}

interface RegisterData {
  email: string;
  name: string;
  password: string;
  username: string;
}

interface RegisterFormData extends RegisterData {
  passwordConfirm: string;
}

export { LogInData, RegisterData, RegisterFormData };
