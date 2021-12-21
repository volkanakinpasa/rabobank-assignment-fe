import './style.css';

import { FORM_INPUT_IDS, FORM_INPUT_NAMES, MESSAGES } from '../constants';
import { get, post } from '../api/users';
import { timeout, validatePassword } from '../helper';

import ISignUpForm from '../interfaces/ISignUpForm';
import IUser from '../interfaces/IUser';
import Loading from './Loading';
import SignedUp from './SignedUp';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function SignUpForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [showSignedUp, setShowSignedUp] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ISignUpForm>();

  const handleValidate = (password: string): boolean => {
    const { firstName, lastName } = getValues();
    return validatePassword(password, firstName, lastName);
  };

  const onSubmit = async (data: ISignUpForm) => {
    try {
      setLoading(true);
      const result: IUser = await post(data);
      console.log(result);

      await timeout(4000);

      const users: IUser[] = await get(result._id);
      console.log(users);
      setShowForm(false);
      setShowSignedUp(true);
    } catch {
      setLoading(false);
    }
  };

  const { ERRORS, EMAIL_PATTERN } = MESSAGES;
  const {
    FIRST_NAME_REQUIRED,
    LAST_NAME_REQUIRED,
    EMAIL_REQUIRED,
    EMAIL_INVALID,
    PASSWORD_REQUIRED,
    PASSWORD_MIN,
    PASSWORD_VALIDATE,
  } = ERRORS;

  const { FIRST_NAME, LAST_NAME, EMAIL, PASSWORD } = FORM_INPUT_NAMES;

  return (
    <div className="signup-container">
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            id={FORM_INPUT_IDS.FIRST_NAME}
            type="text"
            placeholder={FIRST_NAME}
            autoComplete="name"
            {...register(`firstName`, {
              required: FIRST_NAME_REQUIRED,
            })}
          />
          {errors.firstName && (
            <div>
              <p>{errors.firstName.message}</p>
            </div>
          )}

          <input
            id={FORM_INPUT_IDS.LAST_NAME}
            type="text"
            placeholder={LAST_NAME}
            {...register('lastName', {
              required: LAST_NAME_REQUIRED,
            })}
          />
          {errors.lastName && (
            <div>
              <p>{errors.lastName.message}</p>
            </div>
          )}
          <input
            id={FORM_INPUT_IDS.EMAIL}
            type="text"
            autoComplete={FORM_INPUT_IDS.EMAIL}
            placeholder={EMAIL}
            {...register('email', {
              required: EMAIL_REQUIRED,
              pattern: {
                value: EMAIL_PATTERN,
                message: EMAIL_INVALID,
              },
            })}
          />
          {errors.email && (
            <div>
              <p>{errors.email.message}</p>
            </div>
          )}
          <input
            type="password"
            id={FORM_INPUT_IDS.PASSWORD}
            autoComplete="current-password"
            placeholder={PASSWORD}
            data-testid={FORM_INPUT_IDS.PASSWORD}
            {...register('password', {
              required: PASSWORD_REQUIRED,
              minLength: { value: 8, message: PASSWORD_MIN },
              validate: handleValidate,
            })}
          />
          {errors.password && (
            <div>
              <p>{errors.password.message}</p>
              {errors.password.type === 'validate' && (
                <p>{PASSWORD_VALIDATE}</p>
              )}
            </div>
          )}

          {!loading && (
            <button type="submit" color="primary">
              Sign Up
            </button>
          )}

          {loading && <Loading />}
        </form>
      )}
      {showSignedUp && <SignedUp />}
    </div>
  );
}
