import bcrypt from "bcryptjs";

export async function adminPasswordMatches(attempt: string, expected: string) {
  if (!expected) return false;
  if (expected.startsWith("$2")) {
    return bcrypt.compare(attempt, expected);
  }
  const fallbackHash = await bcrypt.hash(expected, 12);
  return bcrypt.compare(attempt, fallbackHash);
}
