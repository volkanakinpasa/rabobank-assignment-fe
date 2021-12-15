import './style.css';

import { FORM_INPUT_IDS, FORM_INPUT_NAMES, MESSAGES } from '../constants';
import { get, post } from '../api/users';

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

  const validatePassword = (password: string): boolean => {
    const { firstName, lastName } = getValues();

    //what does Should contain lower and uppercase letters mean?. should it contain numbers? or do you mean only accepts lowercase and uppercase?
    // /(?=.*[a-z])(?=.*[A-Z])/.test(password) &&

    if (
      firstName.length > 0 &&
      password.toLowerCase().indexOf(firstName.toLowerCase()) > -1
    ) {
      return false;
    } else if (
      lastName.length > 0 &&
      password.toLowerCase().indexOf(lastName.toLowerCase()) > -1
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (data: ISignUpForm) => {
    try {
      setLoading(true);
      const result: IUser = await post(data);
      console.log(result);

      setTimeout(async () => {
        const users: IUser[] = await get(result._id);

        console.log(users);
        setShowForm(false);
        setShowSignedUp(true);
      }, 4000);
    } catch {
      setLoading(false);
    }
  };

  const Label = ({
    name,
    labelFor,
  }: {
    name: string;
    labelFor: string;
  }): JSX.Element => <label htmlFor={labelFor}>{name}</label>;

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
          <Label name={FIRST_NAME} labelFor={FORM_INPUT_IDS.FIRST_NAME} />
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

          <Label name={LAST_NAME} labelFor={FORM_INPUT_IDS.LAST_NAME} />
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
          <Label name={EMAIL} labelFor={FORM_INPUT_IDS.EMAIL} />
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
          <Label name={PASSWORD} labelFor={FORM_INPUT_IDS.PASSWORD} />
          <input
            type="password"
            id={FORM_INPUT_IDS.PASSWORD}
            autoComplete="current-password"
            placeholder={PASSWORD}
            data-testid={FORM_INPUT_IDS.PASSWORD}
            {...register('password', {
              required: PASSWORD_REQUIRED,
              minLength: { value: 8, message: PASSWORD_MIN },
              validate: validatePassword,
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
