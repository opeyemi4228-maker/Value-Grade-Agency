// Password hashing (scrypt) and opaque tokens. No third-party crypto.
import "server-only";

import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;
const PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function scryptAsync(password, salt) {
  return new Promise((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEYLEN, PARAMS, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt);
  return `scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password, stored) {
  const [alg, saltB64, keyB64] = String(stored || "").split("$");
  if (alg !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64url");
  const actual = await scryptAsync(password, Buffer.from(saltB64, "base64url"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// A dummy hash so failed logins for unknown emails take the same time as real ones.
let dummy;
export async function burnTime(password) {
  dummy ||= await hashPassword("not-a-real-password");
  await verifyPassword(password, dummy);
}

export const newToken = () => randomBytes(32).toString("base64url");
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
