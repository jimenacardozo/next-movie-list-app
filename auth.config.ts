import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const googleClientId = process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET
const googleConfigured =
  !!googleClientId && !googleClientId.startsWith("placeholder") &&
  !!googleClientSecret && !googleClientSecret.startsWith("placeholder")

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    // Credentials authorize runs server-side only, safe to include here as a stub
    // The real validation happens in auth.ts via the full config
    Credentials({}),
    ...(googleConfigured
      ? [{ id: "google", name: "Google", type: "oauth" as const }]
      : []),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user || request.nextUrl.pathname.startsWith("/login")
    },
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
}
