import bcrypt from "bcrypt"
import { findUserByEmail, createUser } from "../dal/users.dal"
import type { RegisterInput } from "../lib/validations/auth"

export async function validateCredentials(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user || !user.password) return null
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return null
  return { id: user.id, email: user.email, name: user.name }
}

export async function register(input: RegisterInput) {
  const existing = await findUserByEmail(input.email)
  if (existing) throw new Error("Email already in use")
  const hashed = await bcrypt.hash(input.password, 12)
  return createUser({ name: input.name, email: input.email, password: hashed })
}
