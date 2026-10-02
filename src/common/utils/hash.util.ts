import * as bcrypt from 'bcrypt';
import { env } from 'process';

const SALT_ROUNDS = env.SALT_ROUNDS ? parseInt(env.SALT_ROUNDS) : 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
