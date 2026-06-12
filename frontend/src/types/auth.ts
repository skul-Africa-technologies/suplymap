export interface RegisterFormData {
  firstName: string;
  lastName: string;
  industry: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
