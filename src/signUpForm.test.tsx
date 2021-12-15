import { render, screen, waitFor } from '@testing-library/react';

import IUser from './interfaces/IUser';
import { MESSAGES } from './constants';
import SignUpForm from './components/SignUpForm';
import userEvent from '@testing-library/user-event';

const { ERRORS } = MESSAGES;
const {
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  EMAIL_REQUIRED,
  EMAIL_INVALID,
  PASSWORD_REQUIRED,
  PASSWORD_MIN,
  PASSWORD_VALIDATE,
} = ERRORS;

jest.mock('./api/users', () => ({
  post: () =>
    new Promise<IUser>((res, rej) => {
      res({
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        _id: 'string',
      });
    }),
  get: () =>
    new Promise<IUser[]>((res, rej) => {
      res([
        {
          firstName: 'string',
          lastName: 'string',
          email: 'string',
          _id: 'string',
        },
      ]);
    }),
}));

jest.setTimeout(60000);

describe('SignUpForm component', () => {
  it('creates form snapshot', () => {
    const { asFragment } = render(<SignUpForm />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows required error messages when form submitted', async () => {
    render(<SignUpForm />);

    userEvent.click(screen.getByText(/Sign Up/i));
    await waitFor(() => {
      expect(screen.getByText(FIRST_NAME_REQUIRED)).toBeInTheDocument();
      expect(screen.getByText(LAST_NAME_REQUIRED)).toBeInTheDocument();
      expect(screen.getByText(EMAIL_REQUIRED)).toBeInTheDocument();
      expect(screen.getByText(PASSWORD_REQUIRED)).toBeInTheDocument();
    });
  });

  it('shows email is invalid when email has no @', async () => {
    render(<SignUpForm />);
    userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'test');
    userEvent.click(screen.getByText(/Sign Up/i));
    await waitFor(() => {
      expect(screen.getByText(EMAIL_INVALID)).toBeInTheDocument();
    });
  });

  it('shows password min x charters error message', async () => {
    render(<SignUpForm />);
    userEvent.type(screen.getByTestId('password'), 'test');
    userEvent.click(screen.getByText(/Sign Up/i));
    await waitFor(() => {
      expect(screen.getByText(PASSWORD_MIN)).toBeInTheDocument();
    });
  });

  it('shows password error message when first name exist in', async () => {
    render(<SignUpForm />);
    userEvent.type(
      screen.getByRole('textbox', { name: 'First Name' }),
      'fname'
    );
    userEvent.type(screen.getByTestId('password'), 'fnameSDFGHJ');
    userEvent.click(screen.getByText(/Sign Up/i));
    await waitFor(() => {
      expect(screen.getByText(PASSWORD_VALIDATE)).toBeInTheDocument();
    });
  });

  it('shows password error message when last name exist in', async () => {
    render(<SignUpForm />);
    userEvent.type(screen.getByRole('textbox', { name: 'Last Name' }), 'lname');
    userEvent.type(screen.getByTestId('password'), 'lnameSDFGHJ');
    userEvent.click(screen.getByText(/Sign Up/i));
    await waitFor(() => {
      expect(screen.getByText(PASSWORD_VALIDATE)).toBeInTheDocument();
    });
  });

  it('submits form', async () => {
    render(<SignUpForm />);

    userEvent.type(
      screen.getByRole('textbox', { name: 'First Name' }),
      'firstName'
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Last Name' }),
      'lastName'
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'test@test.com'
    );
    userEvent.type(screen.getByTestId('password'), 'qwertyuiosdf');
    userEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(
      async () => {
        await timeout(4000);
        expect(screen.getByText('Signed up!')).toBeInTheDocument();
      },
      { timeout: 40000 }
    );
  });
});

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
