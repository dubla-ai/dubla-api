import * as bcryptjs from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  storedPasswordHash: string,
): Promise<boolean> => {
  return bcryptjs.compare(password, storedPasswordHash);
};
