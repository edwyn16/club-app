import { randomBytes, scrypt as scryptCallback, timingSafeEqual, } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const SALT_LENGTH = 32;
const ALGORITHM = "scrypt";

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH);

    const derivedKey = (await scrypt(
        password,
        salt,
        KEY_LENGTH,
    )) as Buffer;

    return `${ALGORITHM}:${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
    password: string,
    storedHash: string,
): Promise<boolean> {
    const parts = storedHash.split(":");

    if (parts.length !== 3 || parts[0] !== ALGORITHM) {
        return false;
    }

    const [, saltHex, hashHex] = parts;

    if (!saltHex || !hashHex) {
        return false;
    }

    if (
        saltHex.length !== SALT_LENGTH * 2 ||
        hashHex.length !== KEY_LENGTH * 2 ||
        !/^[0-9a-f]+$/i.test(saltHex) ||
        !/^[0-9a-f]+$/i.test(hashHex)
    ) {
        return false;
    }

    const salt = Buffer.from(saltHex, "hex");
    const storedKey = Buffer.from(hashHex, "hex");

    const derivedKey = (await scrypt(
        password,
        salt,
        KEY_LENGTH,
    )) as Buffer;

    return timingSafeEqual(storedKey, derivedKey);
}