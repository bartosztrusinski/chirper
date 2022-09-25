import bcrypt from 'bcryptjs';

const generateHash = async (input: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedInput = bcrypt.hash(input, salt);
  return hashedInput;
};

export default generateHash;
