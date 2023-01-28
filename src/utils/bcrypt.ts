import { raw } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';

export async function hash(data: string): Promise<string> {
  const rounds = 12;
  const salt = await bcrypt.genSalt(rounds);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

export async function check(args: {
  raw: string;
  hash: string;
}): Promise<boolean> {
  return await bcrypt.compare(args.raw, args.hash);
}
