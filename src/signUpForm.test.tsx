import { FORM_INPUT_IDS, FORM_INPUT_NAMES, MESSAGES } from './constants';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import IUser from './interfaces/IUser';
import SignUpForm from './components/SignUpForm';
import { timeout } from './helper';
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

const { FIRST_NAME, LAST_NAME, EMAIL, PASSWORD } = FORM_INPUT_NAMES;

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
    // const { getByTestId } = render(<SignUpForm />);
    // const emailInput: any = getByTestId(FORM_INPUT_IDS.EMAIL);
    // userEvent.type(emailInput, 'test');
    // userEvent.click(screen.getByText(/Sign Up/i));
    // await waitFor(() => {
    //   expect(screen.getByText(EMAIL_INVALID)).toBeInTheDocument();
    //   screen.debug();
    // });

    const { getByPlaceholderText } = render(<SignUpForm />);
    const emailInput = getByPlaceholderText(EMAIL);
    userEvent.type(emailInput, 'test');
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
    const { getByPlaceholderText } = render(<SignUpForm />);

    userEvent.type(getByPlaceholderText(FIRST_NAME), 'fname');
    userEvent.type(screen.getByTestId('password'), 'fnameSDFGHJ');
    userEvent.click(screen.getByText(/Sign Up/i));
    await waitFor(() => {
      expect(screen.getByText(PASSWORD_VALIDATE)).toBeInTheDocument();
    });
  });

  it('shows password error message when last name exist in', async () => {
    const { getByPlaceholderText } = render(<SignUpForm />);

    userEvent.type(getByPlaceholderText(LAST_NAME), 'lname');
    userEvent.type(screen.getByTestId('password'), 'lnameSDFGHJ');
    userEvent.click(screen.getByText(/Sign Up/i));
    await waitFor(() => {
      expect(screen.getByText(PASSWORD_VALIDATE)).toBeInTheDocument();
    });
  });

  it('submits form', async () => {
    const { getByPlaceholderText } = render(<SignUpForm />);

    userEvent.type(getByPlaceholderText(FIRST_NAME), 'firstName');

    userEvent.type(getByPlaceholderText(LAST_NAME), 'lastName');
    userEvent.type(getByPlaceholderText(EMAIL), 'test@test.com');
    userEvent.type(screen.getByTestId('password'), 'qwertyuiosdf');
    userEvent.click(screen.getByText(/Sign Up/i));

    await waitFor(
      async () => {
        await timeout(4100);
        expect(screen.getByText('Signed up!')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
