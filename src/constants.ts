const API_URL = process.env.REACT_APP_API_URL;

export const LINKS = {
  SIGN_UP: '/',
};

export const API_ENDPOINTS = {
  USERS: `${API_URL}/users`,
};

//or i18n
export const MESSAGES = {
  EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  ERRORS: {
    FIRST_NAME_REQUIRED: 'First name is required',
    LAST_NAME_REQUIRED: 'Last name is required',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Email is invalid',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN: 'Enter min 8 charters',
    PASSWORD_VALIDATE: 'Should not contain first name and last name',
  },
};

export const FORM_INPUT_NAMES = {
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  EMAIL: 'Email',
  PASSWORD: 'Password',
};
export const FORM_INPUT_IDS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PASSWORD: 'password',
};
