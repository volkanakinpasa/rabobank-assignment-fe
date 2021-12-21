const timeout = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const validatePassword = (
  password: string,
  firstName: string,
  lastName: string
): boolean => {
  // /(?=.*[a-z])(?=.*[A-Z])/.test(password) &&
  const loweredPassword = password.toLowerCase();

  if (firstName && loweredPassword.includes(firstName.toLowerCase())) {
    return false;
  } else if (lastName && loweredPassword.includes(lastName.toLowerCase())) {
    return false;
  } else {
    return true;
  }
};

export { timeout, validatePassword };
