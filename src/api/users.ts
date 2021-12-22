import { API_ENDPOINTS } from '../constants';
import ISignUpForm from '../interfaces/ISignUpForm';
import IUser from '../interfaces/IUser';

const post = async (data: ISignUpForm): Promise<IUser> => {
  const rawResponse = await fetch(API_ENDPOINTS.USERS, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return rawResponse.json();
};

const get = async (id: string): Promise<IUser[]> => {
  const rawResponse = await fetch(`${API_ENDPOINTS.USERS}?_id=${id}`, {
    method: 'GET',
  });
  return rawResponse.json();
};

export { post, get };
