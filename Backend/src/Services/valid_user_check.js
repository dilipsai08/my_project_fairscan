import { findUserByUsername } from "../Models/db_queries.js";

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function isUsernameUnique(username) {
    const existingUser = await findUserByUsername(username);
    return !existingUser;
}