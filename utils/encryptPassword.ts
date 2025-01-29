import bcrypt from "bcrypt";

export const encryptPassword = async (
  password: string
): Promise<{ salt: string; encryptedPassword: string }> => {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  return { salt, encryptedPassword };
};
