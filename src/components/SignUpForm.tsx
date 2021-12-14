import './style.css';

import { get, post } from '../api/users';

import ISignUpForm from '../interfaces/ISignUpForm';
import IUser from '../interfaces/IUser';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function SignUpForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [hideForm, setHideForm] = useState<boolean>(false);
  const [showSignedUp, setShowSignedUp] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ISignUpForm>();

  const validatePassword = (password: string): boolean => {
    const { firstName, lastName } = getValues();

    return (
      /(?=.*[a-z])(?=.*[A-Z])/.test(password) &&
      password.toLowerCase().indexOf(firstName.toLowerCase()) === -1 &&
      password.toLowerCase().indexOf(lastName.toLowerCase()) === -1
    );
  };

  const onSubmit = async (data: ISignUpForm) => {
    try {
      setLoading(true);
      const result: IUser = await post(data);
      console.log(result);

      setTimeout(async () => {
        const users: IUser[] = await get(result._id);

        console.log(users);
        setHideForm(true);
        setShowSignedUp(true);
      }, 4000);
    } catch {
      setLoading(false);
    } finally {
    }
  };

  return (
    <div className="signup-container">
      {!hideForm && (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <label>First Name</label>
          <input
            autoComplete="name"
            type="text"
            id="firstName"
            placeholder="First Name"
            {...register('firstName', {
              required: true,
            })}
          />
          {errors.firstName && (
            <span>
              <p>First name is required</p>
            </span>
          )}
          <label>Last Name</label>
          <input
            type="text"
            id="lastName"
            placeholder="Last Name"
            {...register('lastName', {
              required: true,
            })}
          />
          {errors.lastName && (
            <span>
              <p>Last name is required</p>
            </span>
          )}
          <label>Email</label>
          <input
            id="email"
            autoComplete="email"
            type="text"
            placeholder="Email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Email is invalid',
              },
            })}
          />
          {errors.email && (
            <span>
              <p>{errors.email?.message}</p>
            </span>
          )}
          <label>Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Password"
            {...register('password', {
              required: true,
              minLength: 8,
              validate: validatePassword,
            })}
          />
          {errors.password && (
            <span>
              <p>Enter min 8 charters</p>
              <p>Should contain at least one lower and uppercase</p>
              <p>Should not contain first name and last name</p>
            </span>
          )}

          {!loading && (
            <button type="submit" color="primary">
              Sign Up
            </button>
          )}
          {loading && <div className="loading">Loading</div>}
        </form>
      )}
      {showSignedUp && <span className="signedup">Signed up!</span>}
    </div>
  );
}
