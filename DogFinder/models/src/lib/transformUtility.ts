import { IUser } from './models';

export const toIUser = ({
  id,
  email,
  name,
  surname,
  phone_number,
  posts,
}: IUser): IUser => {
  return { id, email, name, surname, phone_number, posts };
};
