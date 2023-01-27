import bcrypt from 'bcrypt';

export async function hash(data: string): Promise<string> {
  const rounds = 12;
  const salt = await bcrypt.genSalt(rounds);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}
