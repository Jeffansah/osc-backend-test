import { compare } from "bcrypt";

export const decryptPassword = async (
  enteredPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const result = await compare(enteredPassword, hashedPassword);

  return result;
};
