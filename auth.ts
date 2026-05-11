import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/src/lib/prisma"
import { validateCredentials } from "@/src/services/auth.service"
import { authConfig } from "./auth.config"

const googleClientId = process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET
const googleConfigured =
  !!googleClientId && !googleClientId.startsWith("placeholder") &&
  !!googleClientSecret && !googleClientSecret.startsWith("placeholder")

// eslint-disable-next-line @typescript-eslint/no-require-imports
const GoogleProvider = googleConfigured ? require("next-auth/providers/google").default : null

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as any),
  providers: [
    ...(GoogleProvider ? [GoogleProvider] : []),
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials as { email: string; password: string }
        return validateCredentials(email, password)
      },
    }),
  ],
})
